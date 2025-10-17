from yt_dlp import YoutubeDL

ydl_opts = {
    'format': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',  # best 1080p + best audio
    'merge_output_format': 'mp4',   # merge to MP4
    'outtmpl': '%(title)s.%(ext)s', # save file as "title.mp4"
    'noplaylist': True,             # only one video, not playlists
    'quiet': False,                 # show progress
}

# Asks input for the youtube video URL
video_url = input("Enter YouTube video URL: ")

# Run the downloader
with YoutubeDL(ydl_opts) as ydl:
    ydl.download([video_url])

print("\n✅ Download complete! Check this folder for your video.")