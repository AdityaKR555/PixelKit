# PixelKit — Image Utility

A small React + Vite app for compressing images to a target file size and merging two images into one.

## Features
- Image compression with common and custom KB targets
- Side-by-side or vertical image merging
- Download results as JPEG
- Local browser processing; no backend or database

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Notes
- Exact target sizes cannot be guaranteed for every image. Compression attempts to meet the target and reports when it cannot.
- Images are processed in the browser. Very large images may use significant device memory.
- PNG transparency is flattened onto white when exporting to JPEG.
