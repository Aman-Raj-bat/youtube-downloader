const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
    const { url } = req.query;
    if (!ytdl.validateURL(url)) {
        return res.status(400).send("Invalid YouTube URL");
    }

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(url, { format: "mp4" }).pipe(res);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
