const express = require("express");
const { download } = require("../controllers/downloadController");

const router = express.Router();

/**
 * GET /api/download
 * Downloads a YouTube video or audio in the specified format
 * Query params: url, itag, type
 */
router.get("/download", download);

module.exports = router;
