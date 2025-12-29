/**
 * Selects the best audio-only format from available formats
 * Prioritizes by bitrate and codec quality
 * @param {Array} formats - Array of all available formats
 * @returns {number|null} - itag of best audio format, or null if none found
 */
const selectBestAudio = (formats) => {
    if (!formats || !Array.isArray(formats)) {
        return null;
    }

    // Filter for audio-only formats
    const audioFormats = formats.filter(
        (format) =>
            format.mimeType &&
            format.mimeType.startsWith("audio/") &&
            format.audioBitrate
    );

    if (audioFormats.length === 0) {
        return null;
    }

    // Sort by bitrate (descending) and select the best
    audioFormats.sort((a, b) => {
        // Prioritize higher bitrate
        const bitrateDiff = (b.audioBitrate || 0) - (a.audioBitrate || 0);
        if (bitrateDiff !== 0) return bitrateDiff;

        // If bitrate is same, prefer certain codecs
        const codecPriority = { opus: 3, "mp4a.40.2": 2, vorbis: 1 };
        const aCodec = a.audioCodec || "";
        const bCodec = b.audioCodec || "";
        return (codecPriority[bCodec] || 0) - (codecPriority[aCodec] || 0);
    });

    return audioFormats[0].itag;
};

module.exports = {
    selectBestAudio,
};
