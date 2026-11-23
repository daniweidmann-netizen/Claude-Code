#!/usr/bin/env python3
"""Turn a background-removed RGBA cutout into a red outline PNG of size W x H.

usage: make_outline.py CUTOUT.png OUT.png W H [thickness]
"""
import sys
from PIL import Image, ImageFilter

src, out, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
t = int(sys.argv[5]) if len(sys.argv) > 5 else 9
im = Image.open(src).convert("RGBA").resize((W, H), Image.LANCZOS)
a = im.getchannel("A").point(lambda v: 255 if v > 110 else 0)
a = a.filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15))  # drop specks
a = a.filter(ImageFilter.MedianFilter(9))            # smooth jaggies
outer = a.filter(ImageFilter.MaxFilter(t | 1))
inner = a.filter(ImageFilter.MinFilter(3))
ring = Image.composite(outer, Image.new("L", (W, H), 0), Image.eval(inner, lambda v: 255 - v))
res = Image.new("RGBA", (W, H), (0, 0, 0, 0))
red = Image.new("RGBA", (W, H), (235, 20, 20, 255))
res.paste(red, (0, 0), ring)
res.save(out)
print("ok", out)
