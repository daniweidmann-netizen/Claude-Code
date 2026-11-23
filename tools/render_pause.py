#!/usr/bin/env python3
"""Render a 'pause challenge' short (1080x1920).

usage: render_pause.py SEG.mp4 CAM.mp4 OUTLINE.png TARGET_S OUT.mp4 [--game x,y,w,h] [--name "Kai Cenat"]
SEG = original 16:9 segment (audio + gameplay), CAM = facecam video (same timing, any size),
OUTLINE = red outline PNG sized 1080x608, TARGET_S = time (s) where the pose matches.
"""
import argparse, os, subprocess, tempfile

FONT = "Inter ExtraBold"
ap = argparse.ArgumentParser()
ap.add_argument("seg"); ap.add_argument("cam"); ap.add_argument("outline"); ap.add_argument("target", type=float)
ap.add_argument("out")
ap.add_argument("--game", default="268,0,1012,720")
ap.add_argument("--name", default="Kai Cenat")
a = ap.parse_args()
gx, gy, gw, gh = map(int, a.game.split(","))
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.seg],
                           capture_output=True, text=True).stdout)
CW, CH, CY = 1080, 608, 430
GH = round(1080 * gh / gw / 2) * 2
GY = CY + CH + 20


def t(s):
    s = max(0, s); return f"0:{int(s // 60):02d}:{s % 60:05.2f}"


ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Top,{FONT},74,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,7,0,8,40,40,0,1
Style: Close,{FONT},96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,8,0,5,40,40,0,1
Style: Small,{FONT},60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,6,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,{t(0)},{t(dur)},Top,,0,0,0,,{{\\pos(540,120)}}Only {{\\c&H0000E5FF&}}1%{{\\c&H00FFFFFF&}} can pause when\\N{a.name.upper()} matches\\Nthe outline!
Dialogue: 2,{t(a.target + 0.08)},{t(dur)},Close,,0,0,0,,{{\\pos(540,{CY + CH + 110})\\fscx60\\fscy60\\t(0,120,\\fscx100\\fscy100)}}SOOOO CLOSE
Dialogue: 2,{t(a.target + 0.08)},{t(dur)},Small,,0,0,0,,{{\\pos(540,{CY + CH + 200})}}1 frame off...
"""
tmp = tempfile.mkdtemp()
ap_ = os.path.join(tmp, "p.ass"); open(ap_, "w").write(ass)
fc = (f"[0:v]split=2[b][g];"
      f"[b]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.3[bg];"
      f"[1:v]scale={CW}:{CH}:force_original_aspect_ratio=increase:flags=lanczos,crop={CW}:{CH},unsharp=5:5:0.6[cam];"
      f"[g]crop={gw}:{gh}:{gx}:{gy},scale=1080:{GH}:flags=lanczos[game];"
      f"[bg][cam]overlay=0:{CY}[t1];[t1][2:v]overlay=0:{CY}[t2];[t2][game]overlay=0:{GY}[t3];"
      f"[t3]ass='{ap_}'[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.seg, "-i", a.cam, "-loop", "1", "-i", a.outline,
                "-filter_complex", fc, "-map", "[v]", "-map", "0:a", "-t", f"{dur:.2f}",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
                "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
                "-movflags", "+faststart", a.out], check=True)
print("done", a.out)
