# Claude-Code

## YouTube Agent Skill

A [Claude Code skill](https://code.claude.com/docs/en/skills) at `.claude/skills/youtube/` that lets Claude
work with YouTube: metadata and chapters, full transcripts with timestamps, search, comments,
playlists and downloads. Claude loads it automatically when you share a YouTube link or ask about
YouTube content.

```bash
pip install -U yt-dlp            # only dependency (ffmpeg needed for --audio / merging)
python3 .claude/skills/youtube/scripts/yt.py info       https://youtu.be/VIDEO_ID
python3 .claude/skills/youtube/scripts/yt.py transcript https://youtu.be/VIDEO_ID [--lang de] [--format text|json|srt]
python3 .claude/skills/youtube/scripts/yt.py search     "query" -n 10
python3 .claude/skills/youtube/scripts/yt.py comments   https://youtu.be/VIDEO_ID -n 50
python3 .claude/skills/youtube/scripts/yt.py playlist   https://www.youtube.com/playlist?list=...
python3 .claude/skills/youtube/scripts/yt.py download   https://youtu.be/VIDEO_ID [--audio]
```

Example prompts: *"Summarize https://youtu.be/… with timestamps"*, *"What does the speaker say about
pricing in this video?"*, *"Find the 5 most-viewed videos on X from this year and compare them"*.

Tests (offline): `python3 -m unittest discover -s .claude/skills/youtube/tests`
