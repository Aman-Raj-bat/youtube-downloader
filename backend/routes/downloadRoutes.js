const express = require('express');
const downloadController = require('../controllers/downloadController');

const router = express.Router();

/**
 * POST /api/download
 * Body: { url: string, mode: 'audio' | 'video' }
 * Returns: file as attachment or JSON error
 */
router.post('/download', downloadController.handleDownload);

module.exports = router;
