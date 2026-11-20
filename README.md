# Kinda Whimsical Games

The studio site at [kindawhimsical.com](https://kindawhimsical.com). Built with [Astro](https://astro.build) and deployed to GitHub Pages by a GitHub Action on every push to `main`.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Where things live

| What | Where |
| --- | --- |
| Games (one file per game) | `src/content/games/*.md` |
| Game clips, GIFs, screenshots | `public/media/games/<slug>/` |
| Hand-drawn art (auto-converted to WebP) | `src/assets/art/` |
| Team photos | `src/assets/team/` |
| Email and social links | `src/site.ts` |
| Colours and type | `src/styles/global.css` |

## Adding or updating a game

Create `src/content/games/my-game.md` (the file name becomes the URL, `/games/my-game/`):

```md
---
title: My Game
tagline: One short line about it.
status: Prototype        # Concept | Prototype | In development | Playtesting | Early access | Released
order: 7                 # position in lists
genres: [Roguelike]
platforms: [Windows, Mac]
color: '#F5B48C'         # accent for this game
sticker: fox             # a drawing from src/assets/art (no extension)
clip: /media/games/my-game/loop.mp4
poster: /media/games/my-game/poster.jpg
trailer: dQw4w9WgXcQ     # YouTube id, optional
gallery:
  - { src: /media/games/my-game/shot-1.jpg, alt: The hero crossing a bridge }
links:
  - { label: Play in your browser, url: https://example.itch.io/my-game }
  - { label: Download for Windows, url: https://example.com/my-game.zip }
draft: false             # true hides it from the site
---

A couple of paragraphs about the game.
```

Without a `clip` or `poster`, the game shows a "Footage on the way" placeholder in its own colour.

## Making clips

GIFs work (`clip: /media/games/x/thing.gif`), but a short MP4 loop is usually 5–10× smaller and looks better. To convert a screen recording or GIF:

```sh
./scripts/make-clip.sh ~/Desktop/recording.mov my-game 12 15   # start at 12s, 15s long
```

This writes `loop.mp4`, `loop.webm` and `poster.jpg` into `public/media/games/my-game/`. Clips play silently on a loop, only while they're on screen, and not at all for visitors who have reduced motion turned on. Aim for 10–20 seconds and under ~5 MB.

## Deployment

The workflow in `.github/workflows/deploy.yml` builds and publishes the site. In the repo's **Settings → Pages**, **Source** must be set to **GitHub Actions**. The custom domain comes from `public/CNAME`.
