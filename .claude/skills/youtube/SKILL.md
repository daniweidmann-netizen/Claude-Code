---
name: youtube
description: Work with YouTube videos, playlists and channels - fetch metadata, chapters and full transcripts (with timestamps), search YouTube, read top comments, list playlist entries, and download video or audio. Use whenever the user shares a YouTube link (youtube.com, youtu.be, shorts) or asks to summarize, transcribe, quote, analyze, compare, search or download YouTube content.
---

# YouTube Agent Skill

All YouTube access goes through one helper script built on `yt-dlp`:

```bash
python3 .claude/skills/youtube/scripts/yt.py <command> [options]
```

If it reports `yt-dlp is not installed`, run `pip install -U yt-dlp` and retry.
Every command prints JSON to stdout (except `transcript --format text|srt`), so
pipe through `jq` when you only need some fields.

## Commands

| Goal | Command |
|---|---|
| Metadata (title, channel, duration, views, description, chapters, available caption languages) | `yt.py info URL` |
| Transcript as readable paragraphs with `[mm:ss]` stamps | `yt.py transcript URL` |
| Transcript in a given language | `yt.py transcript URL --lang de` |
| Raw caption segments as JSON | `yt.py transcript URL --format json` |
| Subtitle file | `yt.py transcript URL --format srt > subs.srt` |
| Search YouTube | `yt.py search "query" -n 10` |
| Top comments | `yt.py comments URL -n 50` |
| List a playlist / channel's videos | `yt.py playlist URL -n 100` |
| Download video / audio-only | `yt.py download URL [--audio] [-o DIR]` |

`transcript` prefers creator-uploaded subtitles and falls back to YouTube's
auto-generated captions; the JSON header line `# source:` tells you which. Use
`--chunk N` to change paragraph length in seconds (default 30, `0` = one line per caption).

## Workflows

**Summarize a video**
1. `yt.py info URL` - note title, channel, duration and chapters.
2. `yt.py transcript URL` - read the whole transcript. For very long videos
   (> ~2h) save it to a file and read it in parts.
3. Write the summary: a 2-3 sentence TL;DR, then key points grouped by chapter
   (or by topic if there are no chapters), each with a clickable timestamp link
   `https://youtu.be/<id>?t=<seconds>`.
4. Make clear which claims are the speaker's, not verified facts.

**Answer a question about a video** - fetch the transcript, find the relevant
passage, quote it briefly and give the timestamp link.

**Compare / research across videos** - `yt.py search` to find candidates, `info`
to filter by date/length/views, then fetch transcripts only for the ones you'll use.

**Audience sentiment** - `yt.py comments URL -n 100`, group into themes, and
weight by `like_count`.

## Rules

- Never invent transcript content. If no captions exist (`transcript` exits
  with "No captions available"), say so; offer to download the audio
  (`download --audio`) for a speech-to-text tool if one is available.
- Auto-generated captions have no punctuation and misspell names; correct
  obvious errors when quoting, and mention the transcript is auto-generated.
- Only download when the user asks for a file, and remind them to respect the
  creator's rights and YouTube's Terms of Service.
- Age-restricted, private or members-only videos fail without cookies; report
  the error instead of retrying. The user can pass a browser cookie file with
  `--cookies cookies.txt` (supported by every command).
- If requests fail with a network/proxy error, YouTube is likely not reachable
  from this environment - tell the user rather than guessing at content.
