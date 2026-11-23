#!/usr/bin/env python3
"""IRL 'pause at the right time' challenge (1080x1920).

usage: render_irl_pause.py SEG.mp4 CUTOUT.png TARGET_S OUT.mp4 --crop x,w --name "SPEED" [--tail 0.45]
SEG = 16:9 segment (1920x1080), CUTOUT = background-removed RGBA of the crop region at TARGET_S,
crop x,w = horizontal crop of the source (full height). The clip ends TAIL seconds after TARGET_S.
"""
import argparse, os, subprocess, tempfile
from PIL import Image, ImageFilter

FONT = "Inter ExtraBold"
ap = argparse.ArgumentParser()
ap.add_argument("seg"); ap.add_argument("cutout"); ap.add_argument("target", type=float); ap.add_argument("out")
ap.add_argument("--crop", required=True)
ap.add_argument("--name", default="SPEED")
ap.add_argument("--tail", type=float, default=0.45)
a = ap.parse_args()
cx, cw = map(int, a.crop.split(","))
VW = 1080; VH = round(1080 * 1080 / cw / 2) * 2
VY = 1920 - VH - 60
end = a.target + a.tail
tmp = tempfile.mkdtemp()

# outline from cutout, keep only the largest blob (the streamer)
al = Image.open(a.cutout).convert("RGBA").getchannel("A").resize((VW, VH), Image.LANCZOS)
al = al.point(lambda v: 255 if v > 110 else 0)
al = al.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MedianFilter(7))
outer = al.filter(ImageFilter.MaxFilter(17)); inner = al.filter(ImageFilter.MinFilter(3))
ring = Image.composite(outer, Image.new("L", (VW, VH), 0), Image.eval(inner, lambda v: 255 - v))
ov = Image.new("RGBA", (VW, VH), (0, 0, 0, 0))
ov.paste(Image.new("RGBA", (VW, VH), (240, 20, 20, 255)), (0, 0), ring)
ovp = os.path.join(tmp, "ov.png"); ov.save(ovp)


def t(s):
    s = max(0, s); return f"0:{int(s // 60):02d}:{s % 60:05.2f}"


ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Top,{FONT},76,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,7,0,8,40,40,0,1
Style: Close,{FONT},104,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,9,0,5,40,40,0,1
Style: Small,{FONT},64,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,7,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 1,{t(0)},{t(end)},Top,,0,0,0,,{{\\pos(540,{max(60, VY // 2 - 110)})}}Only {{\\c&H0000E5FF&}}1%{{\\c&H00FFFFFF&}} can pause\\Nwhen {a.name.upper()} fits\\Nthe outline!
Dialogue: 2,{t(a.target + 0.06)},{t(end)},Close,,0,0,0,,{{\\pos(540,{VY + VH - 300})\\fscx60\\fscy60\\t(0,110,\\fscx100\\fscy100)}}SOOOO CLOSE
Dialogue: 2,{t(a.target + 0.06)},{t(end)},Small,,0,0,0,,{{\\pos(540,{VY + VH - 200})}}1 frame off...
"""
assp = os.path.join(tmp, "p.ass"); open(assp, "w").write(ass)
fc = (f"[0:v]split=2[b][v0];"
      f"[b]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.35[bg];"
      f"[v0]crop={cw}:ih:{cx}:0,scale={VW}:{VH}:flags=lanczos[v1];"
      f"[bg][v1]overlay=0:{VY}[t1];[t1][1:v]overlay=0:{VY}[t2];[t2]ass='{assp}'[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.seg, "-loop", "1", "-i", ovp,
                "-filter_complex", fc, "-map", "[v]", "-map", "0:a", "-t", f"{end:.2f}",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
                "-movflags", "+faststart", a.out], check=True)
print("done", a.out)
