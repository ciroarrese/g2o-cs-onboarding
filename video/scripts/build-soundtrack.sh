#!/usr/bin/env bash
# Builds public/music/soundtrack.m4a for the full video (3:13, 5790 frames at 30 fps).
# Track: "Lo-Fi 04" by Mixkit (Mixkit Stock Music Free License: web and social video,
# no attribution; not allowed: TV/radio, CD/DVD, games, remixes as music-only tracks).
# The mp3 is downloaded, not committed: the license does not allow redistributing it alone.
#
# Tempo ~107.1 BPM, one bar = 2.2408 s. The music starts at 0:44 (percussion enters),
# jumps back 36 bars (80.67 s) where the second agenda starts (video 1:22), and runs
# into the ending of the track over the closing scene.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=public/music/lofi-04.mp3
OUT=public/music/soundtrack.m4a
[ -f "$SRC" ] || curl -sSL -A "Mozilla/5.0" -o "$SRC" https://assets.mixkit.co/music/766/766.mp3
START=44        # track second where the video starts
CUT=126         # track second where the second agenda starts (44 + 82)
BACK=80.67      # 36 bars
TOTAL=193       # video length in seconds
XF=1            # crossfade
B=$(python3 -c "print(round($CUT - $BACK, 3))")
ffmpeg -v error -y \
  -ss "$START" -to "$(python3 -c "print($CUT + $XF/2)")" -i "$SRC" \
  -ss "$(python3 -c "print(round($B - $XF/2, 3))")" -i "$SRC" \
  -filter_complex "[0:a][1:a]acrossfade=d=$XF:c1=tri:c2=tri,afade=t=in:d=0.6,atrim=0:$TOTAL,afade=t=out:st=$(python3 -c "print($TOTAL-2.5)"):d=2.5[a]" \
  -map "[a]" -c:a aac -b:a 192k "$OUT"
echo "built $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") s)"
