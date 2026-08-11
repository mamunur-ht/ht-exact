# HT Exact

A small family of client-side "hit an exact file size" tools. Everything
runs in the browser — no files are ever uploaded to a server.

- **HT Image Compressor** (`/ht-image-compressor/`) — compress
  PNG/JPG/WEBP/AVIF images to a target file size and dimensions.
- **HT Upscale** (`/ht-upscale/`) — enlarge images 2×/3×/4× with a
  Real-ESRGAN AI super-resolution model running locally via WASM.
- **HT Reel** (`/ht-reel/`) — compress MP4/MOV/WEBM/MKV videos to a
  target file size.

`index.html` at this top level is a simple landing page linking to all
three.

## Deploy

Drag this whole `ht-exact` folder into
https://app.netlify.com/drop (or your existing `ht-exact` site's Deploys
tab) — you'll get one site with:

- `yoursite.netlify.app/` → landing page
- `yoursite.netlify.app/ht-image-compressor/` → HT Image Compressor
- `yoursite.netlify.app/ht-upscale/` → HT Upscale
- `yoursite.netlify.app/ht-reel/` → HT Reel

Same idea on Vercel: import this folder as the project root, framework
preset "Other" (no build command needed).

No redirects or separate domains needed — all tools live under the one
site/domain, cross-linked to each other and to the landing page.
