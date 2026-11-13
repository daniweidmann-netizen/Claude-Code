// Gemeinsames Sprechtempo für alle Stimmen-Anbieter.
// Etwas zügigeres Sprechen wirkt in Kurzvideos lebendiger. Das fertige Audio wird mit FFmpeg
// (atempo, Tonhöhe bleibt gleich) beschleunigt und als schlichtes MP3 ohne ID3/Xing-Header
// ausgegeben (iOS-Safari spielt solche Dateien im Web Audio zuverlässig ab).
import { spawn } from 'node:child_process';
import { config } from '../../config.js';

export const TEMPO = Number(process.env.VOICE_TEMPO || 1.18);

export function speedUp(buf, tempo = TEMPO) {
  if (!(tempo > 0.5 && tempo < 2) || tempo === 1) return Promise.resolve(buf);
  return new Promise((resolve) => {
    const p = spawn(config.ffmpegPath, ['-loglevel', 'error', '-i', 'pipe:0', '-filter:a', `atempo=${tempo}`, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-id3v2_version', '0', '-write_xing', '0', '-f', 'mp3', 'pipe:1']);
    const out = [];
    p.stdout.on('data', (d) => out.push(d));
    p.on('error', () => resolve(buf)); // kein FFmpeg → Originaltempo
    p.on('close', (code) => resolve(code === 0 && out.length ? Buffer.concat(out) : buf));
    p.stdin.on('error', () => {});
    p.stdin.end(buf);
  });
}
