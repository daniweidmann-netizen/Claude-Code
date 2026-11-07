#!/usr/bin/env python3
"""YouTube helper for the Claude Code `youtube` skill.

Subcommands: info, transcript, search, comments, playlist, download.
Built on yt-dlp (pip install -U yt-dlp). Output is JSON unless noted.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys

PREFERRED_SUB_FORMATS = ("json3", "vtt", "srv3", "srv1", "ttml")


# --------------------------------------------------------------------------- #
# yt-dlp plumbing
# --------------------------------------------------------------------------- #
class _SilentLogger:
    """yt-dlp prints errors itself; we report them once via sys.exit."""

    def debug(self, msg):
        pass

    warning = info = error = debug


def _ydl(cookies: str | None = None, **opts):
    try:
        import yt_dlp
    except ImportError:
        sys.exit("error: yt-dlp is not installed. Run: pip install -U yt-dlp")
    base = {"quiet": True, "no_warnings": True, "noprogress": True, "logger": _SilentLogger()}
    if cookies:
        base["cookiefile"] = cookies
    base.update(opts)
    return yt_dlp.YoutubeDL(base)


def _extract(url: str, cookies: str | None = None, **opts) -> dict:
    with _ydl(cookies, skip_download=True, **opts) as ydl:
        try:
            return ydl.sanitize_info(ydl.extract_info(url, download=False))
        except Exception as e:  # yt_dlp.utils.DownloadError and friends
            sys.exit(f"error: {_clean_err(e)}")


def _clean_err(e: Exception) -> str:
    return re.sub(r"\x1b\[[0-9;]*m", "", str(e)).replace("ERROR: ", "")


def _out(obj) -> None:
    json.dump(obj, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")


def fmt_ts(seconds: float) -> str:
    s = int(seconds)
    h, rem = divmod(s, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def _srt_ts(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


# --------------------------------------------------------------------------- #
# Caption parsing (pure functions, unit-tested)
# --------------------------------------------------------------------------- #
def parse_json3(data: str | dict) -> list[dict]:
    """Parse YouTube json3 captions into [{start, end, text}]."""
    doc = json.loads(data) if isinstance(data, str) else data
    segs = []
    for ev in doc.get("events", []):
        if "segs" not in ev or ev.get("aAppend"):
            continue
        text = "".join(s.get("utf8", "") for s in ev["segs"])
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        start = ev.get("tStartMs", 0) / 1000
        end = start + ev.get("dDurationMs", 0) / 1000
        segs.append({"start": start, "end": end, "text": text})
    return segs


_VTT_TIME = re.compile(
    r"(?:(\d+):)?(\d{2}):(\d{2})[.,](\d{3})\s+-->\s+(?:(\d+):)?(\d{2}):(\d{2})[.,](\d{3})"
)


def _hms(h, m, s, ms) -> float:
    return int(h or 0) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def parse_vtt(data: str) -> list[dict]:
    """Parse WebVTT/SRT into [{start, end, text}], removing the rolling
    duplicate lines YouTube auto-captions produce."""
    segs: list[dict] = []
    lines = data.replace("\r\n", "\n").split("\n")
    i = 0
    while i < len(lines):
        m = _VTT_TIME.search(lines[i])
        if not m:
            i += 1
            continue
        g = m.groups()
        start, end = _hms(*g[:4]), _hms(*g[4:])
        i += 1
        body = []
        while i < len(lines) and lines[i].strip():
            body.append(lines[i])
            i += 1
        for raw in body:
            text = re.sub(r"<[^>]+>", "", raw)  # inline timing / style tags
            text = html.unescape(re.sub(r"\s+", " ", text)).strip()
            if not text:
                continue
            # auto-captions repeat the previous line at the top of each cue
            if segs and text == segs[-1]["text"]:
                segs[-1]["end"] = max(segs[-1]["end"], end)
                continue
            segs.append({"start": start, "end": end, "text": text})
    return segs


def chunk_segments(segs: list[dict], seconds: float) -> list[dict]:
    """Merge caption segments into paragraphs roughly `seconds` long."""
    if seconds <= 0:
        return segs
    out: list[dict] = []
    for s in segs:
        if out and s["start"] - out[-1]["start"] < seconds:
            out[-1]["text"] += " " + s["text"]
            out[-1]["end"] = max(out[-1]["end"], s["end"])
        else:
            out.append(dict(s))
    return out


def to_srt(segs: list[dict]) -> str:
    return "\n".join(
        f"{n}\n{_srt_ts(s['start'])} --> {_srt_ts(s['end'])}\n{s['text']}\n"
        for n, s in enumerate(segs, 1)
    )


def pick_track(info: dict, lang: str | None):
    """Return (source, lang_code, track) choosing manual subs over auto."""
    want = (lang or info.get("language") or "en").lower()
    for source, key in (("manual", "subtitles"), ("auto-generated", "automatic_captions")):
        tracks = {k: v for k, v in (info.get(key) or {}).items() if k != "live_chat"}
        if not tracks:
            continue
        code = _match_lang(tracks, want)
        if code is None and source == "auto-generated" and lang is None:
            # auto captions: original-language track is suffixed "-orig"
            code = next((k for k in tracks if k.endswith("-orig")), None)
        if code is None and source == "manual" and lang is None:
            code = next(iter(tracks))
        if code is None:
            continue
        by_ext = {f.get("ext"): f for f in tracks[code]}
        for ext in PREFERRED_SUB_FORMATS:
            if ext in by_ext:
                return source, code, by_ext[ext]
    return None


def _match_lang(tracks: dict, want: str):
    """Exact code, then '<code>-orig', then any track sharing the base language."""
    lower = {k.lower(): k for k in tracks}
    for cand in (want, f"{want}-orig"):
        if cand in lower:
            return lower[cand]
    base = want.split("-")[0]
    return next((k for lk, k in lower.items() if lk.split("-")[0] == base), None)


# --------------------------------------------------------------------------- #
# Commands
# --------------------------------------------------------------------------- #
def cmd_info(a):
    info = _extract(a.url, a.cookies)
    _out({
        "id": info.get("id"),
        "title": info.get("title"),
        "url": info.get("webpage_url"),
        "channel": info.get("channel") or info.get("uploader"),
        "channel_url": info.get("channel_url"),
        "channel_followers": info.get("channel_follower_count"),
        "upload_date": info.get("upload_date"),
        "duration": info.get("duration"),
        "duration_string": info.get("duration_string"),
        "view_count": info.get("view_count"),
        "like_count": info.get("like_count"),
        "comment_count": info.get("comment_count"),
        "is_live": info.get("is_live"),
        "age_limit": info.get("age_limit"),
        "language": info.get("language"),
        "categories": info.get("categories"),
        "tags": info.get("tags"),
        "chapters": [
            {"start": c["start_time"], "timestamp": fmt_ts(c["start_time"]), "title": c["title"]}
            for c in info.get("chapters") or []
        ],
        "subtitle_languages": sorted((info.get("subtitles") or {}).keys()),
        "auto_caption_languages_count": len(info.get("automatic_captions") or {}),
        "thumbnail": info.get("thumbnail"),
        "description": info.get("description"),
    })


def cmd_transcript(a):
    info = _extract(a.url, a.cookies)
    picked = pick_track(info, a.lang)
    if not picked:
        langs = sorted((info.get("subtitles") or {}).keys())
        sys.exit(
            "error: No captions available"
            + (f" for language '{a.lang}'. Manual subtitle languages: {langs}" if a.lang else ".")
        )
    source, code, track = picked
    with _ydl(a.cookies) as ydl:
        try:
            raw = ydl.urlopen(track["url"]).read().decode("utf-8", "replace")
        except Exception as e:
            sys.exit(f"error: failed to download captions: {_clean_err(e)}")
    segs = parse_json3(raw) if track.get("ext") == "json3" else parse_vtt(raw)
    if not segs:
        sys.exit("error: caption track was empty.")

    vid = info.get("id")
    if a.format == "srt":
        sys.stdout.write(to_srt(segs))
        return
    if a.format == "json":
        _out({"id": vid, "title": info.get("title"), "source": source, "language": code,
              "segments": [{**s, "start": round(s["start"], 2), "end": round(s["end"], 2)} for s in segs]})
        return
    print(f"# {info.get('title')}")
    print(f"# url: https://youtu.be/{vid}  source: {source} captions  language: {code}")
    print()
    for p in chunk_segments(segs, a.chunk):
        print(f"[{fmt_ts(p['start'])}] {p['text']}" if not a.no_timestamps else p["text"])


def cmd_search(a):
    info = _extract(f"ytsearch{a.n}:{a.query}", a.cookies, extract_flat="in_playlist")
    _out([_flat_entry(e) for e in info.get("entries") or []])


def cmd_playlist(a):
    info = _extract(a.url, a.cookies, extract_flat="in_playlist", playlistend=a.n)
    _out({
        "title": info.get("title"),
        "channel": info.get("channel") or info.get("uploader"),
        "count": info.get("playlist_count"),
        "entries": [_flat_entry(e) for e in info.get("entries") or []],
    })


def _flat_entry(e: dict) -> dict:
    vid = e.get("id")
    return {
        "id": vid,
        "title": e.get("title"),
        "url": e.get("url") if (e.get("url") or "").startswith("http") else f"https://www.youtube.com/watch?v={vid}",
        "channel": e.get("channel") or e.get("uploader"),
        "duration": e.get("duration"),
        "view_count": e.get("view_count"),
    }


def cmd_comments(a):
    info = _extract(
        a.url, a.cookies, getcomments=True,
        extractor_args={"youtube": {"max_comments": [str(a.n), "all", "0"], "comment_sort": [a.sort]}},
    )
    comments = [
        {
            "author": c.get("author"),
            "text": c.get("text"),
            "like_count": c.get("like_count"),
            "is_pinned": c.get("is_pinned"),
            "is_uploader": c.get("author_is_uploader"),
            "time": c.get("_time_text"),
        }
        for c in (info.get("comments") or [])
        if c.get("parent") in (None, "root")
    ][: a.n]
    _out({"id": info.get("id"), "title": info.get("title"),
          "total_comments": info.get("comment_count"), "comments": comments})


def cmd_download(a):
    opts = {"outtmpl": f"{a.output}/%(title).150B [%(id)s].%(ext)s", "restrictfilenames": False}
    if a.audio:
        opts["format"] = "bestaudio/best"
        opts["postprocessors"] = [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3"}]
    else:
        opts["format"] = f"bv*[height<={a.max_height}]+ba/b[height<={a.max_height}]/b"
        opts["merge_output_format"] = "mp4"
    files: list[str] = []
    opts["postprocessor_hooks"] = [lambda d: d["status"] == "finished" and files.append(d["info_dict"].get("filepath"))]
    with _ydl(a.cookies, **opts) as ydl:
        try:
            ydl.download([a.url])
        except Exception as e:
            sys.exit(f"error: {_clean_err(e)}")
    _out({"files": sorted({f for f in files if f})})


# --------------------------------------------------------------------------- #
def main(argv=None):
    p = argparse.ArgumentParser(prog="yt.py", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--cookies", help="Netscape cookies.txt for age-restricted/private videos")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("info", help="video metadata, chapters, caption languages")
    s.add_argument("url")
    s.set_defaults(func=cmd_info)

    s = sub.add_parser("transcript", help="video transcript")
    s.add_argument("url")
    s.add_argument("--lang", help="language code, e.g. en, de, pt-BR (default: video language)")
    s.add_argument("--format", choices=("text", "json", "srt"), default="text")
    s.add_argument("--chunk", type=float, default=30, help="paragraph length in seconds for text output (0 = per caption)")
    s.add_argument("--no-timestamps", action="store_true")
    s.set_defaults(func=cmd_transcript)

    s = sub.add_parser("search", help="search YouTube")
    s.add_argument("query")
    s.add_argument("-n", type=int, default=10)
    s.set_defaults(func=cmd_search)

    s = sub.add_parser("comments", help="top-level comments")
    s.add_argument("url")
    s.add_argument("-n", type=int, default=50)
    s.add_argument("--sort", choices=("top", "new"), default="top")
    s.set_defaults(func=cmd_comments)

    s = sub.add_parser("playlist", help="list playlist or channel videos")
    s.add_argument("url")
    s.add_argument("-n", type=int, default=100)
    s.set_defaults(func=cmd_playlist)

    s = sub.add_parser("download", help="download video or audio")
    s.add_argument("url")
    s.add_argument("--audio", action="store_true", help="audio only (mp3)")
    s.add_argument("--max-height", type=int, default=1080)
    s.add_argument("-o", "--output", default=".")
    s.set_defaults(func=cmd_download)

    a = p.parse_args(argv)
    a.func(a)


if __name__ == "__main__":
    main()
