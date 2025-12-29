const ytdl = require("@distube/ytdl-core");

/**
 * Validates if the provided URL is a valid YouTube URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid YouTube URL, false otherwise
 */
const validateYouTubeURL = (url) => {
    if (!url || typeof url !== "string") {
        return false;
    }

    try {
        // Attempt to extract video ID - if successful, URL is valid
        const videoID = ytdl.getURLVideoID(url);
        return videoID && videoID.length > 0;
    } catch (error) {
        // If getVideoID throws an error, the URL is invalid
        return false;
    }
};

module.exports = {
    validateYouTubeURL,
};
