const { spawn } = require('child_process');
const path = require('path');

/**
 * Run yt-dlp to download audio or video
 * @param {string} url - YouTube or other video URL
 * @param {string} mode - 'audio' or 'video'
 * @param {string} outTemplate - output file template path, e.g., /tmp/ytdlp-xxx/%(title)s.%(ext)s
 * @param {object} opts - optional extra options
 * @returns {Promise<string>} - resolves with path to output file
 *
 * Tune: You can modify format strings, add extra args, or implement retry logic here
 * For queue-based processing later, replace this with job queue submission
 */
function runYtDlp(url, mode, outTemplate, opts = {}) {
  return new Promise((resolve, reject) => {
    // Build yt-dlp arguments
    const args = [
      '--no-playlist',
      '-o', outTemplate,
    ];

    if (mode === 'audio') {
      // Download best audio and convert to mp3
      args.push('-f', 'bestaudio');
      args.push('--extract-audio');
      args.push('--audio-format', 'mp3');
      args.push('--audio-quality', '192K');
    } else if (mode === 'video') {
      // Download best video + audio and merge
      args.push('-f', 'bestvideo+bestaudio/best');
      args.push('--merge-output-format', 'mp4');
    }

    // Add URL at the end
    args.push(url);

    console.log(`[yt-dlp] Spawning with args:`, args);

    // Spawn yt-dlp process
    const child = spawn('yt-dlp', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stderr = '';
    let stdout = '';

    // Capture stderr for debugging
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Capture stdout for debugging
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    // Handle process completion
    child.on('close', (code) => {
      if (code === 0) {
        // Success: infer output filename from template
        // (Real implementation would parse stdout or scan directory)
        // For MVP, scan the temp directory
        const tempDir = path.dirname(outTemplate);
        const fs = require('fs');
        try {
          const files = fs.readdirSync(tempDir);
          if (files.length > 0) {
            const outputFile = path.join(tempDir, files[0]);
            console.log(`[yt-dlp] Success. Output: ${outputFile}`);
            resolve(outputFile);
          } else {
            reject(new Error('No file produced by yt-dlp'));
          }
        } catch (err) {
          reject(err);
        }
      } else {
        console.error(`[yt-dlp] stderr:`, stderr);
        console.error(`[yt-dlp] stdout:`, stdout);
        reject(new Error(`yt-dlp exited with non-zero exit code: ${code}`));
      }
    });

    // Handle process errors (e.g., yt-dlp not found)
    child.on('error', (err) => {
      console.error(`[yt-dlp] Error spawning process:`, err.message);
      reject(err);
    });
  });
}

module.exports = runYtDlp;
