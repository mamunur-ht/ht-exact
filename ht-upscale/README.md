# HT Upscale

Enlarge images 2×, 3×, or 4× with AI super-resolution — entirely in the
browser. Nothing is uploaded anywhere.

HT Upscale runs the [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)
`realesr-general-x4v3` model (BSD-3-Clause) through
[onnxruntime-web](https://onnxruntime.ai/) (WASM, single-threaded — no
COOP/COEP headers needed, so it works on plain static hosts like Netlify
drop or Vercel "Other"). It's the enlargement sibling of HT Exact and HT
Reel, kept as a fully separate tool.

## Features

- 2× / 3× / 4× upscaling with the Real-ESRGAN x4-v3 model — new detail is
  reconstructed, not just stretched
- Batch multiple images, paste from clipboard (Ctrl+V)
- PNG / JPG / WEBP output
- Processed in 256×256 tiles so large images fit in memory; per-file
  progress (tile counter), before/after preview, time taken
- Download individually or all results as a `.zip`
- Output capped at 8192 px on the long side (browser canvas limit) —
  noted in the UI when it applies
- Transparent PNGs are flattened onto white (the model works in RGB)

## Important limitations (be aware before shipping this)

- **First upscale is slow to start**: the ONNX runtime + model (~16 MB
  total) download and initialize the first time. Cached by the browser
  after that.
- **CPU-bound and single-threaded WASM** (multi-threaded cores would need
  COOP/COEP headers, which default Netlify/Vercel don't set). Expect
  roughly 30–90 s per 1024×1024 image at 4× on a typical laptop; smaller
  images and 2× are much faster. WebGPU acceleration is possible later
  via `executionProviders: ['webgpu']` + the `jsep` wasm files if you
  ever add the headers.
- Very large inputs can take several minutes and a lot of RAM — best on
  desktop.

## Files

- `index.html` — the app
- `favicon.ico`, `favicon-*.png` — shared HT brand favicon set
- `vendor/ort/` — onnxruntime-web 1.20.1 self-hosted (loader + SIMD wasm
  core), not loaded from a CDN
- `vendor/models/realesr-general-x4v3.onnx` — Real-ESRGAN x4-v3 model
  (SHA256 `09b757accd747d7e423c1d352b3e8f23e77cc5742d04bae958d4eb8082b76fa4`)

## Run locally

No build step — static files, but must be served over http(s) (ES module
imports and WASM don't work from `file://`).

```bash
npx serve .
```

## Deploy

**Netlify (drag & drop):** https://app.netlify.com/drop — drag the whole
`ht-exact` folder in (this tool lives at `yoursite.netlify.app/ht-upscale/`).

**Vercel:** import the folder, framework preset "Other" (no build command).

## Tech

Plain HTML/CSS/JS. [onnxruntime-web](https://github.com/microsoft/onnxruntime-web)
for inference, [JSZip](https://stuk.github.io/jszip/) (via CDN) for the
"download all" zip.
