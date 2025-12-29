const ytdl = require("@distube/ytdl-core");
const {
    normalizeAudioFormats,
    normalizeVideoFormats,
} = require("../utils/formatNormalizer");

/**
 * Analyzes a YouTube video and returns metadata and available formats
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} - Analysis result with video metadata and formats
 */
const analyzeVideo = async (url) => {
    try {
        // Fetch video info from YouTube
        const info = await ytdl.getInfo(url);

        // Extract video metadata
        const videoDetails = info.videoDetails;
        const metadata = {
            title: videoDetails.title || "Unknown",
            duration: videoDetails.lengthSeconds
                ? formatDuration(parseInt(videoDetails.lengthSeconds))
                : "Unknown",
            thumbnail:
                videoDetails.thumbnails && videoDetails.thumbnails.length > 0
                    ? videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url
                    : "",
        };

        // Get all available formats
        const formats = info.formats || [];

        // Normalize formats into audio and video categories
        const audioFormats = normalizeAudioFormats(formats);
        const videoFormats = normalizeVideoFormats(formats);

        return {
            video: metadata,
            audioFormats,
            videoFormats,
        };
    } catch (error) {
        // Re-throw with more context
        if (error.message.includes("Video unavailable")) {
            throw new Error("Video is unavailable or does not exist");
        }
        throw new Error(`Failed to analyze video: ${error.message}`);
    }
};

/**
 * Formats duration from seconds to HH:MM:SS or MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
};

module.exports = {
    analyzeVideo,
};
