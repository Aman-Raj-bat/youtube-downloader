const express = require("express");
const { analyze } = require("../controllers/analyzeController");

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes a YouTube video URL and returns metadata and available formats
 */
router.post("/analyze", analyze);

module.exports = router;
