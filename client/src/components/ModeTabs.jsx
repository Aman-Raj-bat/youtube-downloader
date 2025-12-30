import './ModeTabs.css';

function ModeTabs({ selectedMode, setSelectedMode }) {
    return (
        <div className="mode-tabs">
            <button
                className={`mode-tab ${selectedMode === 'audio' ? 'active' : ''}`}
                onClick={() => setSelectedMode('audio')}
            >
                <span className="mode-icon">🎵</span>
                <span className="mode-label">Audio</span>
            </button>
            <button
                className={`mode-tab ${selectedMode === 'video' ? 'active' : ''}`}
                onClick={() => setSelectedMode('video')}
            >
                <span className="mode-icon">🎬</span>
                <span className="mode-label">Video</span>
            </button>
        </div>
    );
}

export default ModeTabs;
