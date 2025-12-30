/**
 * FormatSelector Component
 * Allows users to select download quality based on mode
 */

import './FormatSelector.css';

function FormatSelector({
    selectedMode,
    selectedBitrate,
    setSelectedBitrate,
    selectedVideoItag,
    setSelectedVideoItag,
    videoFormats,
}) {
    return (
        <div className="format-selector-container">
            <h3 className="format-heading">Select Quality</h3>

            {/* Audio Mode - Bitrate Selection */}
            {selectedMode === "audio" && (
                <div className="format-grid">
                    <div
                        className={`format-option ${selectedBitrate === 128 ? 'selected' : ''}`}
                        onClick={() => setSelectedBitrate(128)}
                    >
                        <span className="format-main">Standard</span>
                        <span className="format-sub">128 kbps</span>
                    </div>
                    <div
                        className={`format-option ${selectedBitrate === 320 ? 'selected' : ''}`}
                        onClick={() => setSelectedBitrate(320)}
                    >
                        <span className="format-main">High Quality</span>
                        <span className="format-sub">320 kbps</span>
                    </div>
                </div>
            )}

            {/* Video Mode - Format Selection */}
            {selectedMode === "video" && (
                <div className="format-grid">
                    {videoFormats && videoFormats.length > 0 ? (
                        videoFormats.map((format) => (
                            <div
                                key={format.itag}
                                className={`format-option ${selectedVideoItag === format.itag ? 'selected' : ''}`}
                                onClick={() => setSelectedVideoItag(format.itag)}
                            >
                                <span className="format-main">
                                    {format.qualityLabel || format.quality || "Unknown"}
                                </span>
                                <span className="format-sub">
                                    {format.container || "mp4"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="no-formats">No suitable video formats found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FormatSelector;

