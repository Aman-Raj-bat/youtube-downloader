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

    const uniqueFormats = new Map();

    formats
        .filter((format) => format.hasVideo) // Ensure it has video
        .forEach((format) => {
            const qualityLabel = format.qualityLabel;
            if (!qualityLabel) return;

            // Priority Logic:
            // 1. Prefer MP4 container
            // 2. Prefer AVC1 (H.264) codec
            // 3. Prefer format with Audio (if available, mostly 720p/360p)

            const existing = uniqueFormats.get(qualityLabel);
            const isMp4 = format.container === 'mp4';
            const isH264 = format.codecs && format.codecs.includes('avc1');

            // Create a score for sorting/selection
            // MP4 + H264 = 3 points
            // MP4 = 2 points
            // Any format with audio + video = 1.5 points (convenience)
            // Existing score vs New score

            const getScore = (f) => {
                let score = 0;
                if (f.container === 'mp4') score += 2;
                if (f.codecs && f.codecs.includes('avc1')) score += 1;
                if (f.hasAudio && f.hasVideo) score += 0.5;
                return score;
            };

            if (!existing || getScore(format) > getScore(existing)) {
                uniqueFormats.set(qualityLabel, format);
            }
        });

    // Convert map to array and sort by resolution (height) descending
    return Array.from(uniqueFormats.values())
        .map((format) => ({
            itag: format.itag,
            qualityLabel: format.qualityLabel,
            container: format.container || "mp4",
            hasAudio: format.hasAudio || false,
            height: format.height || 0
        }))
        .sort((a, b) => b.height - a.height);
};

module.exports = {
    normalizeAudioFormats,
    normalizeVideoFormats,
};
