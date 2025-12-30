/**
 * API Service Layer
 * Handles all backend communication
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Analyzes a YouTube URL and returns video metadata
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} Video metadata (title, duration, thumbnail)
 */
export const analyzeVideo = async (url) => {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze video');
    }

    return response.json();
};
