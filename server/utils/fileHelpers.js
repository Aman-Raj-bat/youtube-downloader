/**
 * Generates a safe filename for downloaded content
 * @param {string} videoTitle - The title of the video
 * @param {string} container - The file container/extension (e.g., 'mp4', 'm4a')
 * @param {string} type - The download type ('audio' or 'video')
 * @returns {string} - Safe filename for download
 */
const generateFilename = (videoTitle, container, type) => {
    // Sanitize the title to remove invalid filename characters
    const sanitized = videoTitle
        .replace(/[<>:"/\\|?*]/g, "") // Remove invalid characters
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .substring(0, 100); // Limit length

    // Determine prefix based on type
    let prefix = "video";
    if (type === "audio" || type === "audio_mp3") {
        prefix = "audio";
    } else if (type === "video" || type === "video_merged") {
        prefix = "video";
    }

    const timestamp = Date.now();

    return `${prefix}_${sanitized}_${timestamp}.${container}`;
};

/**
 * Maps container format to MIME content type
 * @param {string} container - The file container/extension
 * @returns {string} - MIME type
 */
const getContentType = (container) => {
    const contentTypeMap = {
        mp4: "video/mp4",
        webm: "video/webm",
        m4a: "audio/mp4",
        mp3: "audio/mpeg",
        opus: "audio/opus",
        ogg: "audio/ogg",
        flv: "video/x-flv",
        "3gp": "video/3gpp",
    };

    return contentTypeMap[container] || "application/octet-stream";
};

module.exports = {
    generateFilename,
    getContentType,
};
