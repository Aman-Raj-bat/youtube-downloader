import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");

  const download = () => {
    window.location.href = `http://localhost:5000/download?url=${url}`;
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>YouTube Downloader</h2>
      <input
        type="text"
        placeholder="Paste YouTube link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "300px" }}
      />
      <br /><br />
      <button onClick={download}>Download</button>
    </div>
  );
}

export default App;
