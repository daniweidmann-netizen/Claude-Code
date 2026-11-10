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

// Liest den Video-Codec der Eingabedatei (h264 kann ohne Neukodierung übernommen werden).
function probeCodec(input) {
  return new Promise((resolve) => {
    const p = spawn(config.ffmpegPath.replace(/ffmpeg$/, 'ffprobe'), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', input]);
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.on('error', () => resolve(''));
    p.on('close', () => resolve(out.trim()));
  });
}

// Schonend für schwache Server (z. B. Render Free): H.264 wird nur neu verpackt,
// alles andere sparsam (ultrafast, 1 Thread) neu kodiert.
export async function transcodeToMp4(input, output) {
  const codec = await probeCodec(input);
  const video = codec === 'h264'
    ? ['-c:v', 'copy']
    : ['-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30',
      '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p', '-threads', '1'];
  return new Promise((resolve, reject) => {
    const args = ['-y', '-i', input, ...video, '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-movflags', '+faststart', output];
    const p = spawn(config.ffmpegPath, args);
    let err = '';
    p.stderr.on('data', (d) => { err += d.toString(); if (err.length > 8000) err = err.slice(-8000); });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve(output) : reject(new Error(`FFmpeg exit ${code}: ${err.slice(-500)}`))));
  });
}
