#!/usr/bin/env python3
"""Render a 16:9 Kai Cenat stream segment into a 9:16 TikTok/Shorts edit.

Layout (1080x1920): blurred background, facecam big on top, white title banner,
gameplay below, word-by-word captions, punch-in zoom on the loudest reaction,
0.8s reaction preview as hook, loudness-normalized audio.

usage: render_split.py SRC.mp4 TRANSCRIPT.json "Banner text" OUT.mp4
       [--cam x,y,w,h] [--game x,y,w,h]
"""
import argparse, json, re, subprocess, os, tempfile

FONT = "Inter ExtraBold"
BAD = {"fuck": "f***", "fucking": "f***ing", "fucked": "f***ed", "shit": "s***",
       "bitch": "b****", "nigga": "n****", "niggas": "n****s", "ass": "a**",
       "motherfucker": "m***********", "motherfucking": "m***********", "damn": "d***"}


def run(cmd):
    subprocess.run(cmd, check=True)


def censor(w):
    core = re.sub(r"[^A-Za-z']", "", w).lower()
    for k, v in BAD.items():
        if core == k:
            return v.upper()
    return w.upper()


def ass_time(t):
    t = max(0, t)
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def wrap(text, width=22):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width and cur:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        lines.append(cur)
    return "\\N".join(lines)


def build_ass(words, banner, dur, path, banner_y, cap_y):
    hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Banner,{FONT},62,&H00000000,&H00000000,&H00FFFFFF,&H00FFFFFF,1,0,0,0,100,100,0,0,3,18,0,8,60,60,0,1
Style: Cap,{FONT},78,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,6,3,5,40,40,0,1
Style: CapHi,{FONT},78,&H0000E5FF,&H0000E5FF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,6,3,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = [f"Dialogue: 1,{ass_time(0)},{ass_time(dur)},Banner,,0,0,0,,{{\\an8\\pos(540,{banner_y})}}{wrap(banner)}"]
    # captions: chunks of up to 3 words, current word highlighted
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) == 3 or re.search(r"[.!?,]$", w["word"]):
            chunks.append(cur); cur = []
    if cur:
        chunks.append(cur)
    for ch in chunks:
        for i, w in enumerate(ch):
            st = w["start"]; en = ch[i + 1]["start"] if i + 1 < len(ch) else max(w["end"], w["start"] + 0.25)
            parts = []
            for j, x in enumerate(ch):
                txt = censor(x["word"])
                parts.append(("{\\c&H0000E5FF&}" if j == i else "{\\c&H00FFFFFF&}") + txt)
            ev.append(f"Dialogue: 2,{ass_time(st)},{ass_time(en)},Cap,,0,0,0,,{{\\an5\\pos(540,{cap_y})}}" + " ".join(parts))
    open(path, "w").write(hdr + "\n".join(ev) + "\n")


def loudest(src, dur):
    """Return time (s) of the loudest 1s window in the last 60% of the clip."""
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", src, "-af", "ebur128=peak=none", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    best, bt = -99.0, dur * 0.7
    for m in re.finditer(r"t:\s*([\d.]+)\s+TARGET.*?M:\s*(-?[\d.]+)", out):
        t, lm = float(m.group(1)), float(m.group(2))
        if dur * 0.4 <= t <= dur - 0.5 and lm > best:
            best, bt = lm, t
    return bt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("transcript"); ap.add_argument("banner"); ap.add_argument("out")
    ap.add_argument("--cam", default="0,289,262,147")
    ap.add_argument("--game", default="268,0,1012,720")
    ap.add_argument("--no-hook", action="store_true")
    a = ap.parse_args()
    gx, gy, gw, gh = map(int, a.game.split(","))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.src],
                               capture_output=True, text=True).stdout.strip())
    words = []
    if a.transcript != "-" and os.path.exists(a.transcript):
        try:
            words = json.load(open(a.transcript)).get("words", [])
        except Exception:
            words = []
    peak = loudest(a.src, dur)
    z0, z1 = peak - 0.4, peak + 1.6
    zoom = f"if(between(t,{z0:.2f},{z1:.2f}),1.18,1)"
    tmp = tempfile.mkdtemp()
    ass = os.path.join(tmp, "subs.ass")
    bg = "[b]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];"
    if a.cam == "none":
        # no facecam: banner on top, gameplay big in the middle (punch-in zoom on the peak)
        banner_y = 260
        game_h = round(1080 * gh / gw / 2) * 2
        game_y = 520
        cap_y = game_y + game_h + 110
        build_ass(words, a.banner, dur, ass, banner_y, cap_y)
        fc = (f"[0:v]split=2[b][g];" + bg +
              f"[g]crop={gw}:{gh}:{gx}:{gy},scale=w='trunc(1080*{zoom}/2)*2':h='trunc({game_h}*{zoom}/2)*2':eval=frame,"
              f"crop=1080:{game_h}:(iw-1080)/2:(ih-{game_h})/2[game];"
              f"[bg][game]overlay=0:{game_y}[t2];[t2]ass='{ass}'[v]")
    else:
        cx, cy, cw, ch = map(int, a.cam.split(","))
        cam_h = round(1080 * ch / cw / 2) * 2          # facecam scaled to full width
        cam_h = min(cam_h, 760)
        cam_y = 140
        banner_y = cam_y + cam_h + 24
        game_h = round(1080 * gh / gw / 2) * 2
        game_y = banner_y + 190
        cap_y = game_y + 120
        build_ass(words, a.banner, dur, ass, banner_y, cap_y)
        fc = (
            f"[0:v]split=3[b][c][g];" + bg +
            f"[c]crop={cw}:{ch}:{cx}:{cy},scale=w='trunc(1080*{zoom}/2)*2':h='trunc({cam_h}*{zoom}/2)*2':eval=frame,"
            f"crop=1080:{cam_h}:(iw-1080)/2:(ih-{cam_h})/2,unsharp=5:5:0.8[cam];"
            f"[g]crop={gw}:{gh}:{gx}:{gy},scale=1080:{game_h}[game];"
            f"[bg][cam]overlay=0:{cam_y}[t1];[t1][game]overlay=0:{game_y}[t2];"
            f"[t2]ass='{ass}'[v]"
        )
    main_out = os.path.join(tmp, "main.mp4") if not a.no_hook else a.out
    run(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-filter_complex", fc, "-map", "[v]", "-map", "0:a",
         "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
         "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "160k", "-ar", "44100", main_out])
    if not a.no_hook:
        hook = os.path.join(tmp, "hook.mp4")
        hs = max(0, peak - 0.3)
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{hs:.2f}", "-t", "0.9", "-i", main_out,
             "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30",
             "-c:a", "aac", "-b:a", "160k", "-ar", "44100", hook])
        run(["ffmpeg", "-v", "error", "-y", "-i", hook, "-i", main_out, "-filter_complex",
             "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]", "-map", "[v]", "-map", "[a]",
             "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", a.out])
    print(f"done peak={peak:.1f}s dur={dur:.1f}s -> {a.out}")


if __name__ == "__main__":
    main()
