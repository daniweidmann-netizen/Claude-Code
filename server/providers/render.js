// Render-Modul: wandelt die im Browser aufgenommene Datei per FFmpeg in ein
// plattformtaugliches MP4 (H.264 High, AAC, 1080×1920, 30 fps, faststart) um.
// Alternative: Remotion-Renderer – gleiche Schnittstelle transcode(input) → output-Pfad.
import { spawn } from 'node:child_process';
import { config } from '../config.js';

export function ffmpegAvailable() {
  return new Promise((resolve) => {
    const p = spawn(config.ffmpegPath, ['-version']);
    p.on('error', () => resolve(false));
    p.on('close', (code) => resolve(code === 0));
  });
}

export function transcodeToMp4(input, output) {
  return new Promise((resolve, reject) => {
    const args = [
      '-y', '-i', input,
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30',
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '160k', '-ar', '44100',
      '-movflags', '+faststart',
      output,
    ];
    const p = spawn(config.ffmpegPath, args);
    let err = '';
    p.stderr.on('data', (d) => { err += d.toString(); if (err.length > 8000) err = err.slice(-8000); });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve(output) : reject(new Error(`FFmpeg exit ${code}: ${err.slice(-500)}`))));
  });
}
