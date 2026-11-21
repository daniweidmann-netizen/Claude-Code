#!/usr/bin/env python3
"""Find loud reaction peaks in a stream audio file and print them with transcript context.

usage: find_moments.py AUDIO.mp3 TRANSCRIPT.json [N] [OFFSET]
Prints the N loudest moments (min 45 s apart) with a suggested 30-45 s window that ends
~3 s after the peak, plus the transcript of that window. OFFSET (s) is added to all times
(use the startSeconds of the extracted audio so times match the source video).
TRANSCRIPT may be "-" if no transcript is available.
"""
import json, re, subprocess, sys

audio, tr = sys.argv[1], sys.argv[2]
n = int(sys.argv[3]) if len(sys.argv) > 3 else 12
off = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
segs = []
if tr != "-":
    try:
        segs = json.load(open(tr)).get("segments", [])
    except Exception:
        segs = []
out = subprocess.run(["ffmpeg", "-v", "info", "-i", audio, "-af", "ebur128=peak=none", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
loud = {}
for m in re.finditer(r"t:\s*([\d.]+)\s.*?M:\s*(-?[\d.]+)", out):
    s = int(float(m.group(1)))
    loud[s] = max(loud.get(s, -99.0), float(m.group(2)))
picked = []
for s, v in sorted(loud.items(), key=lambda x: -x[1]):
    if s < 40:
        continue
    if all(abs(s - p) > 45 for p, _ in picked):
        picked.append((s, v))
    if len(picked) >= n:
        break
for s, v in sorted(picked):
    a, b = max(0, s - 32), s + 4
    ctx = " ".join(x["text"].strip() for x in segs if a <= x["start"] <= b)
    print(f"PEAK {s + off:.0f}s  loud={v}  window={a + off:.0f}-{b + off:.0f}\n  {ctx[:420]}\n")
