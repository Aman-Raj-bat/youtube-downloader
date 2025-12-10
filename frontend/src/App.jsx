import { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate input
      if (!url.trim()) {
        setError('Please enter a URL');
        setLoading(false);
        return;
      }

      // POST to backend
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, mode }),
      });

      if (!response.ok) {
        // Try to parse error message from JSON
        let errorMsg = 'Download failed';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = `HTTP ${response.status}`;
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Success: get filename from Content-Disposition or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'download';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      // Read response as blob and trigger download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess(`Downloaded: ${filename}`);
      setUrl('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>YouTube Video Downloader</h1>
      
      <form onSubmit={handleSubmit} className="download-form">
        <div className="form-group">
          <label htmlFor="url">Video URL:</label>
          <input
            id="url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Download Mode:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="audio"
                checked={mode === 'audio'}
                onChange={(e) => setMode(e.target.value)}
                disabled={loading}
              />
              Audio (MP3)
            </label>
            <label>
              <input
                type="radio"
                value="video"
                checked={mode === 'video'}
                onChange={(e) => setMode(e.target.value)}
                disabled={loading}
              />
              Video (MP4)
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Downloading...' : 'Download'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}

export default App;
