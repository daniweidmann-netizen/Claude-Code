#!/usr/bin/env python3
"""Local person cutout with a U2-Net ONNX model (no API needed).

usage: cutout.py MODEL.onnx IN.png OUT.png
OUT is RGBA: the input image with the person mask as alpha.
Models: u2net_human_seg.onnx (best for people) or u2netp.onnx (small, general).
https://github.com/danielgatis/rembg/releases/download/v0.0.0/<model>
"""
import sys
import numpy as np
import onnxruntime as ort
from PIL import Image

model, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert("RGB")
x = np.asarray(im.resize((320, 320), Image.LANCZOS), dtype=np.float32) / 255.0
x = (x - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
x = x.transpose(2, 0, 1)[None].astype(np.float32)
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
pred = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
pred = (pred - pred.min()) / max(1e-6, pred.max() - pred.min())
mask = Image.fromarray((pred * 255).astype(np.uint8)).resize(im.size, Image.LANCZOS)
res = im.copy(); res.putalpha(mask); res.save(out)
print("ok", out)
