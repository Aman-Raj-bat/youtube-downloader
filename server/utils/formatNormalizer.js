/**
 * Normalizes audio formats from ytdl-core format data
 * @param {Array} formats - Raw formats array from ytdl-core
 * @returns {Array} - Normalized audio formats
 */
const normalizeAudioFormats = (formats) => {
    if (!formats || !Array.isArray(formats)) {
        return [];
    }

    return formats
        .filter((format) => format.mimeType && format.mimeType.startsWith("audio/"))
        .map((format) => ({
            itag: format.itag,
            bitrate: format.audioBitrate || Math.round((format.bitrate || 0) / 1000),
            codec: format.audioCodec || format.codecs || "unknown",
            container: format.container || "unknown",
        }))
        .filter((format) => format.itag); // Remove any invalid entries
};

/**
 * Normalizes video formats from ytdl-core format data
 * @param {Array} formats - Raw formats array from ytdl-core
 * @returns {Array} - Normalized video formats
 */
const normalizeVideoFormats = (formats) => {
    if (!formats || !Array.isArray(formats)) {
        return [];
    }

    return formats
        .filter((format) => format.mimeType && format.mimeType.startsWith("video/"))
        .map((format) => ({
            itag: format.itag,
            qualityLabel: format.qualityLabel || `${format.height}p` || "unknown",
            fps: format.fps || 0,
            hasAudio: format.hasAudio || false,
        }))
        .filter((format) => format.itag); // Remove any invalid entries
};

module.exports = {
    normalizeAudioFormats,
    normalizeVideoFormats,
};
