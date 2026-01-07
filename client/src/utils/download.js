/**
 * Download Utility
 * Constructs download URLs based on user selections
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Selects the best audio itag from available audio formats
 * @param {Array} audioFormats - Available audio formats from analysis
 * @returns {number|null} Best audio itag or null if none found
 */
const selectBestAudioItag = (audioFormats) => {
    if (!audioFormats || audioFormats.length === 0) {
        return null;
    }

    // Sort by bitrate (highest first) and select the best one
    const sorted = [...audioFormats].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    return sorted[0].itag;
};

/**
 * Constructs the download URL based on mode and selections
 * @param {Object} params - Download parameters
 * @param {string} params.url - YouTube video URL
 * @param {string} params.mode - "audio" or "video"
 * @param {number|null} params.bitrate - Audio bitrate (128 or 320)
 * @param {number|null} params.videoItag - Selected video itag
 * @param {Array} params.audioFormats - Available audio formats from analysis
 * @param {Array} params.videoFormats - Available video formats from analysis
 * @returns {string} Download URL
 */
export const buildDownloadUrl = ({ url, mode, bitrate, videoItag, audioFormats, videoFormats }) => {
    const params = new URLSearchParams();
    params.append('url', url);

    if (mode === 'audio') {
        // Audio mode: type=audio_mp3, bitrate required
        params.append('type', 'audio_mp3');
        if (bitrate) {
            params.append('bitrate', bitrate);
        }
        // Select best audio itag from available audio formats
        console.log('[DEBUG] Audio mode - audioFormats:', audioFormats);
        const audioItag = selectBestAudioItag(audioFormats);
        console.log('[DEBUG] Selected audio itag:', audioItag);
        if (audioItag) {
            params.append('itag', audioItag);
            console.log('[DEBUG] Added itag to params');
        } else {
            console.warn('[WARNING] No audio itag found!');
        }
    } else if (mode === 'video') {
        // Video mode: determine if merged is needed
        const selectedFormat = videoFormats.find(f => f.itag === videoItag);

        if (selectedFormat) {
            // Check if video has audio
            if (selectedFormat.hasAudio) {
                params.append('type', 'video');
            } else {
                params.append('type', 'video_merged');
            }
            params.append('itag', videoItag);
        }
    }

    return `${API_BASE_URL}/download?${params.toString()}`;
};

/**
 * Validates if download is ready based on selections
 * @param {string} mode - "audio" or "video"
 * @param {number|null} bitrate - Audio bitrate
 * @param {number|null} videoItag - Video itag
 * @returns {boolean} True if download can proceed
 */
export const isDownloadReady = (mode, bitrate, videoItag) => {
    if (mode === 'audio') {
        return bitrate !== null;
    } else if (mode === 'video') {
        return videoItag !== null;
    }
    return false;
};
