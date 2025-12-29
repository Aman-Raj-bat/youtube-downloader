const { validateYouTubeURL } = require("../utils/validators");
const { analyzeVideo } = require("../services/youtubeService");

/**
 * Controller for analyzing YouTube videos
 * Handles the /api/analyze POST endpoint
 */
const analyze = async (req, res) => {
    try {
        const { url } = req.body;

        // Validate YouTube URL
        if (!validateYouTubeURL(url)) {
            return res.status(400).json({
                error: true,
                message: "Invalid YouTube URL",
            });
        }

        // Analyze the video
        const result = await analyzeVideo(url);

        // Return successful response
        return res.status(200).json(result);
    } catch (error) {
        // Handle errors
        console.error("Error analyzing video:", error.message);

        // Determine appropriate status code
        const statusCode = error.message.includes("unavailable") ? 404 : 500;

        return res.status(statusCode).json({
            error: true,
            message: error.message || "Internal server error occurred while analyzing video",
        });
    }
};

module.exports = {
    analyze,
};
