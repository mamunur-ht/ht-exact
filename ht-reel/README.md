# HT Reel

Hit an exact video file size, every time.

HT Reel is a single-page, client-side tool that converts MP4/MOV/WEBM/MKV
videos to a **target file size**, entirely in the browser using
[FFmpeg.wasm](https://ffmpegwasm.netlify.app/) — nothing is uploaded to a
server. It's the video sibling of HT Exact (the image version), kept as a
fully separate tool.

## Features

- Convert to MP4 (H.264/AAC) or WEBM (VP9/Opus), batch multiple videos
- Set a target file size (MB) — bitrate is calculated from target size,
  duration, and audio settings, with a safety margin biasing toward
  staying under the target
- Optional width resize (height auto-scales), optional trim (start/end
  seconds), optional "remove audio" to free up more bitrate for quality
- Real encode progress bar per file
- Stat strip per result: original size, result size, % change, duration,
  accuracy vs. target
- Download individual files or all results as a `.zip`
- If a video is already under target and needs no changes, it's left
  completely untouched (no re-encode)
- Branded HT favicon (shared with HT Exact)

## Important limitations (be aware before shipping this)

- **First conversion is slow to start**: the FFmpeg core (~30 MB) has to
  download and initialize the first time. It's cached by the browser
  after that.
- **Encoding is CPU-bound and runs single-threaded in WASM** — expect
  roughly real-time or slower for MP4/H.264, and *much* slower for WEBM/VP9.
  This is fine for short clips, painful for long ones.
- **Target accuracy is approximate** (~5-10%), not as tight as HT Exact's
  image results — video bitrate control is inherently less precise than
  per-image quality search.
- Large files (several hundred MB+) may hit browser memory limits,
  especially on mobile.
- No multi-threaded WASM core is used on purpose — that would need
  cross-origin-isolation headers (COOP/COEP) configured on the host,
  which most static hosts (including default Netlify) don't set. If you
  want to enable the faster multi-threaded core later, you'd add a
  Netlify `_headers` file and switch to `@ffmpeg/core-mt`.

## Files

- `index.html` — the app
- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-180.png`,
  `favicon-192.png`, `favicon-512.png` — shared HT brand favicon set
- `vendor/ffmpeg/`, `vendor/util/`, `vendor/core/` — the FFmpeg.wasm
  engine, self-hosted (not loaded from a CDN) to avoid cross-origin
  worker/CORS issues some browsers or extensions run into with CDN-hosted
  WASM engines

## Run locally

No build step — it's a single static HTML file, but it must be served
over http(s) (module imports and WASM don't work from `file://`).

```bash
npx serve .
```

## Deploy

**Netlify (drag & drop):** https://app.netlify.com/drop — drag the whole
folder in.

**Vercel:** push to GitHub, import at https://vercel.com/new, framework
preset "Other" (no build command needed).

## Tech

Plain HTML/CSS/JS. [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)
(loaded from jsDelivr) for encoding, the browser's own `<video>` element
for reading duration/dimensions, and
[JSZip](https://stuk.github.io/jszip/) (via CDN) for the "download all" zip.
