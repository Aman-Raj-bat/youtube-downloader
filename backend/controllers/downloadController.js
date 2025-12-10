const fs = require('fs');
const path = require('path');
const os = require('os');
const runYtDlp = require('../utils/runYtDlp');

/**
 * Validate URL format (http/https only)
 */
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Best-effort cleanup of temp directory and files
 */
function cleanupTemp(tempDir) {
  try {
    const files = fs.readdirSync(tempDir);
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      fs.unlinkSync(filePath);
    }
    fs.rmdirSync(tempDir);
  } catch (err) {
    console.error(`[cleanup] Error cleaning up ${tempDir}:`, err.message);
  }
}

/**
 * Find the first file in the temporary directory
 * (yt-dlp outputs a single file with the downloaded media)
 */
function findOutputFile(tempDir) {
  const files = fs.readdirSync(tempDir);
  if (files.length === 0) {
    throw new Error('No file produced by yt-dlp');
  }
  return path.join(tempDir, files[0]);
}

/**
 * Main download handler
 * POST /api/download
 * Body: { url, mode }
 * mode: 'audio' or 'video'
 */
async function handleDownload(req, res) {
  const { url, mode } = req.body;
  let tempDir = null;

  try {
    // Validate input
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid URL' });
    }
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'URL must be http or https' });
    }
    if (!mode || !['audio', 'video'].includes(mode)) {
      return res.status(400).json({ error: 'Mode must be "audio" or "video"' });
    }

    // Create unique temporary directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytdlp-'));
    console.log(`[download] Created temp dir: ${tempDir}`);

    // Set output template for yt-dlp
    const outTemplate = path.join(tempDir, '%(title)s.%(ext)s');

    // Run yt-dlp (returns path to output file)
    console.log(`[download] Starting yt-dlp for ${mode} mode: ${url}`);
    const outputFile = await runYtDlp(url, mode, outTemplate);

    // Stream file back to client
    const filename = path.basename(outputFile);
    console.log(`[download] Sending file: ${filename}`);
    res.download(outputFile, filename, (err) => {
      if (err && err.code !== 'ERR_HTTP_HEADERS_SENT') {
        console.error(`[download] Error during file download:`, err.message);
      }
      // Cleanup after sending
      cleanupTemp(tempDir);
    });
  } catch (err) {
    console.error(`[download] Error:`, err.message);

    // Cleanup on error
    if (tempDir) {
      cleanupTemp(tempDir);
    }

    // Return appropriate error response
    if (err.message.includes('non-zero exit code')) {
      return res.status(400).json({ error: 'Download failed. Check URL and try again.' });
    }
    if (err.message.includes('No file produced')) {
      return res.status(400).json({ error: 'No file produced by downloader' });
    }

    res.status(500).json({ error: 'Internal server error during download' });
  }
}

module.exports = {
  handleDownload,
};
