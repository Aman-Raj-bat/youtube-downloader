const { validateYouTubeURL } = require("../utils/validators");
const {
    verifyFormatExists,
    getVideoStream,
    getVideoTitle,
    getAllFormats,
} = require("../services/downloadService");
const { generateFilename, getContentType } = require("../utils/fileHelpers");
const { convertToMP3, mergeVideoAudio } = require("../services/ffmpegService");
const { selectBestAudio } = require("../utils/audioSelector");

/**
 * Controller for downloading YouTube videos/audio
 * Handles the /api/download GET endpoint
 * Supports: audio, video, audio_mp3, video_merged
 */
const download = async (req, res) => {
    try {
        const { url, itag, type, bitrate } = req.query;

        // Validate required parameters
        if (!url || !itag || !type) {
            return res.status(400).json({
                error: true,
                message: "Missing required parameters: url, itag, and type are required",
            });
        }

        // Validate type parameter
        const validTypes = ["audio", "video", "audio_mp3", "video_merged"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: true,
                message: `Invalid type parameter. Must be one of: ${validTypes.join(", ")}`,
            });
        }

        // Validate YouTube URL
        if (!validateYouTubeURL(url)) {
            return res.status(400).json({
                error: true,
                message: "Invalid YouTube URL",
            });
        }

        // Get video title for filename
        const videoTitle = await getVideoTitle(url);

        // Handle different download types
        if (type === "audio_mp3") {
            return await handleMP3Download(req, res, url, itag, bitrate, videoTitle);
        } else if (type === "video_merged") {
            return await handleMergedVideoDownload(req, res, url, itag, videoTitle);
        } else {
            // Phase 2: Direct streaming (audio or video)
            return await handleDirectDownload(req, res, url, itag, type, videoTitle);
        }
    } catch (error) {
        console.error("Error in download controller:", error.message);

        // Only send response if headers haven't been sent yet
        if (!res.headersSent) {
            const statusCode = error.message.includes("unavailable") ? 404 : 500;
            return res.status(statusCode).json({
                error: true,
                message: error.message || "Internal server error occurred while downloading",
            });
        }
    }
};

/**
 * Handles direct streaming download (Phase 2 - unchanged)
 */
const handleDirectDownload = async (req, res, url, itag, type, videoTitle) => {
    // Verify that the requested format exists
    const format = await verifyFormatExists(url, itag);
    if (!format) {
        return res.status(404).json({
            error: true,
            message: `Format with itag ${itag} not found for this video`,
        });
    }

    const container = format.container || "mp4";
    const filename = generateFilename(videoTitle, container, type);

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", getContentType(container));

    // Get and pipe the stream
    const stream = getVideoStream(url, itag);

    // Handle stream errors
    stream.on("error", (error) => {
        console.error("Stream error:", error.message);
        if (!res.headersSent) {
            res.status(500).json({
                error: true,
                message: "Error occurred while streaming video",
            });
        }
    });

    // Pipe the stream to response
    stream.pipe(res);
};

/**
 * Handles MP3 conversion download (Phase 3)
 */
const handleMP3Download = async (req, res, url, itag, bitrate, videoTitle) => {
    // Validate bitrate
    const validBitrates = [128, 192, 256, 320];
    const targetBitrate = parseInt(bitrate) || 128;

    if (!validBitrates.includes(targetBitrate)) {
        return res.status(400).json({
            error: true,
            message: `Invalid bitrate. Must be one of: ${validBitrates.join(", ")}`,
        });
    }

    // Verify that the requested format exists
    const format = await verifyFormatExists(url, itag);
    if (!format) {
        return res.status(404).json({
            error: true,
            message: `Format with itag ${itag} not found for this video`,
        });
    }

    // Check if it's an audio format
    if (!format.mimeType || !format.mimeType.startsWith("audio/")) {
        return res.status(400).json({
            error: true,
            message: "Selected format is not an audio format. Use audio-only itag for MP3 conversion",
        });
    }

    const filename = generateFilename(videoTitle, "mp3", "audio_mp3");

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    // Get audio stream
    const audioStream = getVideoStream(url, itag);

    // Convert to MP3 using FFmpeg
    try {
        const mp3Stream = await convertToMP3(audioStream, targetBitrate);

        mp3Stream.on("error", (error) => {
            console.error("MP3 stream error:", error.message);
            if (!res.headersSent) {
                res.status(500).json({
                    error: true,
                    message: "Error occurred during MP3 conversion",
                });
            }
        });

        mp3Stream.pipe(res);
    } catch (error) {
        console.error("FFmpeg conversion error:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: true,
                message: `FFmpeg conversion failed: ${error.message}`,
            });
        }
    }
};

/**
 * Handles merged video+audio download (Phase 3)
 */
const handleMergedVideoDownload = async (req, res, url, itag, videoTitle) => {
    // Verify that the requested video format exists
    const videoFormat = await verifyFormatExists(url, itag);
    if (!videoFormat) {
        return res.status(404).json({
            error: true,
            message: `Video format with itag ${itag} not found for this video`,
        });
    }

    // Check if it's a video format
    if (!videoFormat.mimeType || !videoFormat.mimeType.startsWith("video/")) {
        return res.status(400).json({
            error: true,
            message: "Selected format is not a video format",
        });
    }

    // Get all formats to select best audio
    const allFormats = await getAllFormats(url);
    const bestAudioItag = selectBestAudio(allFormats);

    if (!bestAudioItag) {
        return res.status(404).json({
            error: true,
            message: "No suitable audio format found for merging",
        });
    }

    const filename = generateFilename(videoTitle, "mp4", "video_merged");

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "video/mp4");

    // Get video and audio streams
    const videoStream = getVideoStream(url, itag);
    const audioStream = getVideoStream(url, bestAudioItag);

    // Merge using FFmpeg
    try {
        const mergedStream = await mergeVideoAudio(videoStream, audioStream);

        mergedStream.on("error", (error) => {
            console.error("Merged stream error:", error.message);
            if (!res.headersSent) {
                res.status(500).json({
                    error: true,
                    message: "Error occurred during video merging",
                });
            }
        });

        mergedStream.pipe(res);
    } catch (error) {
        console.error("FFmpeg merge error:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: true,
                message: `FFmpeg merge failed: ${error.message}`,
            });
        }
    }
};

module.exports = {
    download,
};
