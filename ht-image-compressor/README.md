# HT Image Compressor

Part of **HT Exact**. Hit an exact image file size, every time.

HT Image Compressor is a single-page, client-side tool that converts PNG, JPG, WEBP,
and AVIF images to a **target file size** and **target dimensions**. It
works entirely in the browser — nothing is uploaded to a server.

## Features

- Convert PNG / JPG / WEBP / AVIF, batch multiple images at once, paste
  images directly (Ctrl/Cmd+V)
- AVIF is encoded with a bundled WASM encoder (`@jsquash/avif`, vendored
  in `vendor/`), not native browser support — so it works reliably in
  every browser instead of depending on inconsistent canvas AVIF support
- Set a target file size (KB, binary — matches Windows Explorer's file
  size column) — quality is auto-searched to land just under target,
  with a small safety margin so results never go over
- Set target width/height with an aspect-ratio lock, or keep original
  dimensions
- Live gauge + a stat strip (original size, result size, % change,
  dimensions, accuracy, exact byte count) for each converted image
- Already-under-target images are left completely untouched — no
  unnecessary re-encoding or size inflation
- If compression alone can't reach a small target at full resolution, a
  one-click "Force to target anyway" option reduces resolution too and
  auto-downloads the result
- Per-item and "clear all" removal, "Start over" reset, download-status
  badges and toasts
- Download individual files or all results as a `.zip`
- Branded HT favicon (shared across the HT Exact family)

## Files

- `index.html` — the app
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-180.png`,
  `favicon-192.png`, `favicon-512.png` — brand favicon set
- `vendor/jsquash-avif/`, `vendor/wasm-feature-detect/` — the bundled
  AVIF encoder and its dependency (self-hosted, not loaded from a CDN)

## Run locally

No build step — it's a single static HTML file.

```bash
open index.html
# or
npx serve .
```

## Deploy

**Netlify (drag & drop):** https://app.netlify.com/drop — drag the whole
folder in.

**Vercel:** push to GitHub, import at https://vercel.com/new, framework
preset "Other" (no build command needed).

## Tech

Plain HTML/CSS/JS. Canvas API for resizing/encoding,
[JSZip](https://stuk.github.io/jszip/) (via CDN) for the "download all" zip.
