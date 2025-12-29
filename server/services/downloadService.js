const ytdl = require("@distube/ytdl-core");

/**
 * Verifies that a specific format (itag) exists for a given video
 * @param {string} url - YouTube video URL
 * @param {number} itag - Format itag to verify
 * @returns {Promise<Object|null>} - Format object if found, null otherwise
 */
const verifyFormatExists = async (url, itag) => {
    try {
        const info = await ytdl.getInfo(url);
        const formats = info.formats || [];

        const format = formats.find((f) => f.itag === parseInt(itag));
        return format || null;
    } catch (error) {
        throw new Error(`Failed to verify format: ${error.message}`);
    }
};

/**
 * Gets a download stream for a specific format
 * @param {string} url - YouTube video URL
 * @param {number} itag - Format itag to download
 * @returns {Stream} - Readable stream for the video/audio
 */
const getVideoStream = (url, itag) => {
    try {
        const stream = ytdl(url, {
            quality: itag,
        });

        return stream;
    } catch (error) {
        throw new Error(`Failed to create stream: ${error.message}`);
    }
};

/**
 * Gets video title for filename generation
 * @param {string} url - YouTube video URL
 * @returns {Promise<string>} - Video title
 */
const getVideoTitle = async (url) => {
    try {
        const info = await ytdl.getInfo(url);
        return info.videoDetails.title || "video";
    } catch (error) {
        throw new Error(`Failed to get video title: ${error.message}`);
    }
};

/**
 * Gets all available formats for a video
 * @param {string} url - YouTube video URL
 * @returns {Promise<Array>} - Array of all formats
 */
const getAllFormats = async (url) => {
    try {
        const info = await ytdl.getInfo(url);
        return info.formats || [];
    } catch (error) {
        throw new Error(`Failed to get formats: ${error.message}`);
    }
};

module.exports = {
    verifyFormatExists,
    getVideoStream,
    getVideoTitle,
    getAllFormats,
};
