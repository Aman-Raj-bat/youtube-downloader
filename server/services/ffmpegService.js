const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");

/**
 * Converts an audio stream to MP3 format with specified bitrate
 * @param {Stream} audioStream - Input audio stream
 * @param {number} bitrate - Target bitrate in kbps (e.g., 128, 320)
 * @returns {Stream} - Output MP3 stream
 */
const convertToMP3 = (audioStream, bitrate = 128) => {
    return new Promise((resolve, reject) => {
        const outputStream = new PassThrough();

        // Handle stream errors
        audioStream.on("error", (err) => {
            console.error("Audio stream error:", err.message);
            reject(new Error(`Audio stream failed: ${err.message}`));
        });

        const command = ffmpeg(audioStream)
            .inputOptions(["-re"]) // Read input at native frame rate
            .audioBitrate(bitrate)
            .audioCodec("libmp3lame")
            .format("mp3")
            .on("start", (commandLine) => {
                console.log("FFmpeg MP3 conversion started:", commandLine);
            })
            .on("error", (err) => {
                console.error("FFmpeg MP3 conversion error:", err.message);
                reject(new Error(`FFmpeg conversion failed: ${err.message}`));
            })
            .on("end", () => {
                console.log("FFmpeg MP3 conversion completed");
            });

        // Pipe to output stream and resolve after setup
        command.pipe(outputStream, { end: true });
        resolve(outputStream);
    });
};

/**
 * Merges video and audio streams into a single output
 * @param {Stream} videoStream - Input video stream
 * @param {Stream} audioStream - Input audio stream
 * @returns {Stream} - Output merged stream
 */
const mergeVideoAudio = (videoStream, audioStream) => {
    return new Promise((resolve, reject) => {
        const outputStream = new PassThrough();
        let hasErrored = false;

        // Handle stream errors
        videoStream.on("error", (err) => {
            if (!hasErrored) {
                hasErrored = true;
                console.error("Video stream error:", err.message);
                reject(new Error(`Video stream failed: ${err.message}`));
            }
        });

        audioStream.on("error", (err) => {
            if (!hasErrored) {
                hasErrored = true;
                console.error("Audio stream error:", err.message);
                reject(new Error(`Audio stream failed: ${err.message}`));
            }
        });

        const command = ffmpeg();

        // Add video input with options
        command.input(videoStream).inputOptions(["-re"]);

        // Add audio input with options
        command.input(audioStream).inputOptions(["-re"]);

        // Configure output
        command
            .videoCodec("copy") // Copy video without re-encoding
            .audioCodec("aac") // Encode audio to AAC
            .audioBitrate("128k") // Set audio bitrate
            .format("mp4")
            .outputOptions([
                "-movflags frag_keyframe+empty_moov", // Enable streaming
                "-shortest" // Finish when shortest input ends
            ])
            .on("start", (commandLine) => {
                console.log("FFmpeg merge started:", commandLine);
            })
            .on("error", (err) => {
                if (!hasErrored) {
                    hasErrored = true;
                    console.error("FFmpeg merge error:", err.message);
                    reject(new Error(`FFmpeg merge failed: ${err.message}`));
                }
            })
            .on("end", () => {
                console.log("FFmpeg merge completed");
            });

        // Pipe to output stream and resolve after setup
        command.pipe(outputStream, { end: true });
        resolve(outputStream);
    });
};

/**
 * Checks if FFmpeg is available on the system
 * @returns {Promise<boolean>} - True if FFmpeg is available
 */
const checkFFmpegAvailability = () => {
    return new Promise((resolve) => {
        ffmpeg.getAvailableFormats((err) => {
            if (err) {
                console.error("FFmpeg not available:", err.message);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

module.exports = {
    convertToMP3,
    mergeVideoAudio,
    checkFFmpegAvailability,
};
