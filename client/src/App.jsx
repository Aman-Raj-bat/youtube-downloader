import { useState } from "react";
import { analyzeVideo } from "./services/api";
import Header from "./components/Header";
import ModeTabs from "./components/ModeTabs";
import FormatSelector from "./components/FormatSelector";
import { buildDownloadUrl, isDownloadReady } from "./utils/download";
import "./styles/theme.css";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const [selectedMode, setSelectedMode] = useState("audio");
  const [selectedBitrate, setSelectedBitrate] = useState(null);
  const [selectedVideoItag, setSelectedVideoItag] = useState(null);

  const handleAnalyze = async () => {
    setError(null);
    setAnalysisResult(null);
    setSelectedMode("audio");
    setSelectedBitrate(null);
    setSelectedVideoItag(null);

    if (!url.trim()) {
      setError("⚠️ Please enter a YouTube URL");
      return;
    }

    // Frontend validation pattern for YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      setError("⚠️ Invalid URL Format. Please enter a valid YouTube link.");
      return;
    }

    setLoading(true);

    try {
      const result = await analyzeVideo(url);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const downloadUrl = buildDownloadUrl({
      url,
      mode: selectedMode,
      bitrate: selectedBitrate,
      videoItag: selectedVideoItag,
      videoFormats: analysisResult?.videoFormats || [],
    });
    window.location.href = downloadUrl;
  };

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <div className="main-card">

          {/* Section A: URL Input */}
          <div className="input-section">
            <div className="section-header">
              <h2 className="section-title">Analyze Video</h2>
              <p className="section-helper">Paste a YouTube URL below to extract available formats.</p>
            </div>

            <div className="url-input-container">
              <input
                type="text"
                className="url-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                autoFocus
              />
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
            >
              {loading ? "Processing..." : "Analyze Stream"}
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="loading-indicator">
              <span>Looking up video details...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Success Result Container */}
          {analysisResult && (
            <div className="result-section">

              {/* Analysis Summary */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1.5rem',
                marginBottom: '1rem'
              }}>
                {analysisResult.thumbnail && (
                  <img
                    src={analysisResult.thumbnail}
                    alt="thumb"
                    style={{
                      width: '80px',
                      height: 'auto',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-subtle)'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    marginBottom: '0.25rem',
                    lineHeight: '1.4'
                  }}>
                    {analysisResult.title}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace'
                  }}>
                    {analysisResult.duration}
                  </div>
                </div>
              </div>

              {/* Section B: Mode Tabs */}
              <ModeTabs
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
              />

              {/* Section C: Format Selection */}
              <FormatSelector
                selectedMode={selectedMode}
                selectedBitrate={selectedBitrate}
                setSelectedBitrate={setSelectedBitrate}
                selectedVideoItag={selectedVideoItag}
                setSelectedVideoItag={setSelectedVideoItag}
                videoFormats={analysisResult.videoFormats || []}
              />

              {/* Section D: Download CTA */}
              <button
                className="download-btn"
                onClick={handleDownload}
                disabled={!isDownloadReady(selectedMode, selectedBitrate, selectedVideoItag)}
              >
                {isDownloadReady(selectedMode, selectedBitrate, selectedVideoItag) ? "Download Now" : "Select Format to Download"}
              </button>
            </div>
          )}

        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p style={{ textAlign: 'center' }} className="copyright">© 2025 Aman Raj. All rights reserved.</p>
          {/* <p className="disclaimer">
            Disclaimer: This tool is intended for personal and educational use only.
            Users are solely responsible for complying with YouTube's Terms of Service and applicable copyright laws.
            We do not endorse or encourage the unauthorized downloading of copyrighted content.
          </p> */}
        </div>
      </footer>
    </div>
  );
}

export default App;