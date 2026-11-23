#!/usr/bin/env python3
"""'Stop it at the right time' spin challenge (1080x1920).

The facecam spins inside a circle; a red outline shows the upright pose.
Viewers try to pause when the spinning facecam lines up with the outline.

usage: render_spin.py SEG.mp4 CAM.mp4 CUTOUT.png TARGET_S OUT.mp4
       [--cx X] [--period 1.4] [--game x,y,w,h] [--name "Kai Cenat"]
CAM = facecam video (any 16:9 size), CUTOUT = RGBA cutout of the CAM frame at TARGET_S
(same framing), CX = horizontal centre of the person in a 1080x608 version of CAM.
"""
import argparse, os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFilter

FONT = "Inter ExtraBold"
ap = argparse.ArgumentParser()
for n in ("seg", "cam", "cutout"):
    ap.add_argument(n)
ap.add_argument("target", type=float); ap.add_argument("out")
ap.add_argument("--cx", type=int, default=600)
ap.add_argument("--period", type=float, default=1.4)
ap.add_argument("--game", default="268,0,1012,720")
ap.add_argument("--name", default="Kai Cenat")
a = ap.parse_args()
gx, gy, gw, gh = map(int, a.game.split(","))
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.seg],
                           capture_output=True, text=True).stdout)
D, DY = 860, 400                       # circle diameter / top y
GW, GH = 1080, round(1080 * gh / gw / 2) * 2
GH2 = 1920 - (DY + D + 40) - 60
sq_x = max(0, min(1080 - 608, a.cx - 304))
tmp = tempfile.mkdtemp()

# circle mask, outline overlay, ring
mask = Image.new("L", (D, D), 0); ImageDraw.Draw(mask).ellipse((0, 0, D - 1, D - 1), fill=255)
mask.save(os.path.join(tmp, "mask.png"))
cut = Image.open(a.cutout).convert("RGBA").resize((1080, 608), Image.LANCZOS).crop((sq_x, 0, sq_x + 608, 608))
al = cut.getchannel("A").resize((D, D), Image.LANCZOS).point(lambda v: 255 if v > 110 else 0)
al = al.filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MedianFilter(9))
outer = al.filter(ImageFilter.MaxFilter(19)); inner = al.filter(ImageFilter.MinFilter(3))
ring = Image.composite(outer, Image.new("L", (D, D), 0), Image.eval(inner, lambda v: 255 - v))
ring = Image.composite(ring, Image.new("L", (D, D), 0), mask)
ov = Image.new("RGBA", (D, D), (0, 0, 0, 0))
ov.paste(Image.new("RGBA", (D, D), (240, 20, 20, 255)), (0, 0), ring)
ImageDraw.Draw(ov).ellipse((4, 4, D - 5, D - 5), outline=(255, 255, 255, 255), width=10)
# small marker at the top (12 o'clock) like a wheel pointer
ImageDraw.Draw(ov).polygon([(D // 2 - 28, 0), (D // 2 + 28, 0), (D // 2, 46)], fill=(255, 214, 0, 255))
ov.save(os.path.join(tmp, "ov.png"))


def t(s):
    s = max(0, s); return f"0:{int(s // 60):02d}:{s % 60:05.2f}"


ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Top,{FONT},72,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,7,0,8,40,40,0,1
Style: Close,{FONT},100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,8,0,5,40,40,0,1
Style: Small,{FONT},62,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,6,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,{t(0)},{t(dur)},Top,,0,0,0,,{{\\pos(540,110)}}Only {{\\c&H0000E5FF&}}1%{{\\c&H00FFFFFF&}} can stop {a.name.upper()}\\Nin the outline!
Dialogue: 2,{t(a.target + 0.08)},{t(dur)},Close,,0,0,0,,{{\\pos(540,{DY + D + 120})\\fscx60\\fscy60\\t(0,120,\\fscx100\\fscy100)}}SOOOO CLOSE
Dialogue: 2,{t(a.target + 0.08)},{t(dur)},Small,,0,0,0,,{{\\pos(540,{DY + D + 215})}}1 frame off...
"""
ap_ = os.path.join(tmp, "p.ass"); open(ap_, "w").write(ass)
ang = f"2*PI*(t-{a.target:.3f})/{a.period}"
fc = (f"[0:v]split=2[b][g];"
      f"[b]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.3[bg];"
      f"[1:v]scale=1080:608:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:608,"
      f"crop=608:608:{sq_x}:0,scale={D}:{D}:flags=lanczos,unsharp=5:5:0.5,format=rgba[sq];"
      f"[sq][2:v]alphamerge,rotate='{ang}':c=none:ow={D}:oh={D}[spin];"
      f"[g]crop={gw}:{gh}:{gx}:{gy},scale=1080:{GH}:flags=lanczos,crop=1080:{min(GH, GH2)}[game];"
      f"[bg][game]overlay=0:{DY + D + 40}[t0];"
      f"[t0][spin]overlay=(W-{D})/2:{DY}[t1];[t1][3:v]overlay=(W-{D})/2:{DY}[t2];"
      f"[t2]ass='{ap_}'[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.seg, "-i", a.cam,
                "-loop", "1", "-i", os.path.join(tmp, "mask.png"), "-loop", "1", "-i", os.path.join(tmp, "ov.png"),
                "-filter_complex", fc, "-map", "[v]", "-map", "0:a", "-t", f"{dur:.2f}",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
                "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
                "-movflags", "+faststart", a.out], check=True)
print("done", a.out)
