#!/bin/bash
# Turns the raw generated audio in assets/audio/raw into game files under public/audio.
# Automatic steps only: leading/trailing silence removed, length capped with a short fade-out,
# loudness normalised, mono MP3 for effects, stereo MP3 for music.
# usage: tools/assets/audio.sh
set -euo pipefail
RAW=assets/audio/raw; OUT=public/audio
sfx() { # name max_seconds
  local d=$2
  ffmpeg -v error -y -i "$RAW/$1.mp3" -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.01,atrim=0:$d,afade=t=out:st=$(python3 -c "print(max(0, $d - 0.12))"):d=0.12,loudnorm=I=-18:TP=-2:LRA=11" -ac 1 -ar 44100 -b:a 96k "$OUT/$1.mp3"
}
sfx spin 0.9; sfx land 0.6; sfx win 1.3; sfx winMid 1.9; sfx remove 0.7; sfx step 0.45; sfx station 1.7
sfx relic 1.8; sfx bonus 0.52; sfx door 2.0; sfx freeSpins 2.0; sfx bigWin 1.04; sfx button 0.25
for m in music_base music_free; do
  # Short fades at both ends hide the seam when the track loops.
  ffmpeg -v error -y -i "$RAW/$m.mp3" -af "afade=t=in:st=0:d=0.6,afade=t=out:st=44.2:d=0.7,loudnorm=I=-23:TP=-2:LRA=11" -ac 2 -ar 44100 -b:a 112k "$OUT/$m.mp3"
done
ls -la "$OUT"
