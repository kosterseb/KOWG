#!/usr/bin/env bash
# Turn a screen recording or GIF into a small web loop for the site.
#
#   ./scripts/make-clip.sh <input-file> <game-slug> [start-seconds] [length-seconds]
#
# Example: ./scripts/make-clip.sh ~/Desktop/grain-dunes.mov grain 12 15
#
# Writes public/media/games/<slug>/loop.mp4, loop.webm and poster.jpg (1280px wide, silent).
# Then set in src/content/games/<slug>.md:
#   clip: /media/games/<slug>/loop.mp4
#   poster: /media/games/<slug>/poster.jpg
set -euo pipefail

in="${1:?input file}"; slug="${2:?game slug}"; start="${3:-0}"; len="${4:-15}"
out="public/media/games/$slug"
mkdir -p "$out"
vf="fps=30,scale=1280:-2:flags=lanczos"

ffmpeg -y -ss "$start" -t "$len" -i "$in" -an -vf "$vf" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$out/loop.mp4"
ffmpeg -y -ss "$start" -t "$len" -i "$in" -an -vf "$vf" \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$out/loop.webm"
ffmpeg -y -ss "$start" -i "$in" -frames:v 1 -vf "scale=1280:-2" -q:v 3 "$out/poster.jpg"

ls -lh "$out"
