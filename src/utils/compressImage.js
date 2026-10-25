import { canvasToBlob, loadImage } from "./imageHelpers";

// Encodes a JPEG repeatedly, searching quality first and reducing dimensions
// only when quality adjustment alone cannot meet the requested byte target.
export async function compressImage(file, targetKB, onProgress = () => {}) {
  const targetBytes = Math.max(1, Math.round(Number(targetKB) * 1024));
  const { image, url } = await loadImage(file);

  try {
    let scale = 1;
    let bestBlob = null;
    let bestCanvas = null;
    let bestQuality = 0.92;
    let reachedTarget = false;

    for (let resizePass = 0; resizePass < 9; resizePass++) {
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      let low = 0.08;
      let high = 0.94;
      let passBest = null;
      let passQuality = low;

      // Binary search for the highest JPEG quality at or below the target.
      for (let i = 0; i < 8; i++) {
        const quality = (low + high) / 2;
        const blob = await canvasToBlob(canvas, "image/jpeg", quality);
        onProgress({ phase: "compressing", percent: Math.min(90, 12 + resizePass * 9 + i * 1.5) });
        if (blob.size <= targetBytes) {
          passBest = blob;
          passQuality = quality;
          low = quality;
        } else {
          high = quality;
        }
      }

      // Include the lowest practical quality as a fallback for this dimension.
      const smallest = await canvasToBlob(canvas, "image/jpeg", 0.08);
      if (smallest.size <= targetBytes && (!passBest || smallest.size > passBest.size)) {
        passBest = smallest;
        passQuality = 0.08;
      }

      if (passBest) {
        bestBlob = passBest;
        bestCanvas = canvas;
        bestQuality = passQuality;
        reachedTarget = true;
        break;
      }

      bestBlob = smallest;
      bestCanvas = canvas;
      bestQuality = 0.08;
      scale *= 0.82;
      if (Math.round(image.naturalWidth * scale) < 80 || Math.round(image.naturalHeight * scale) < 80) break;
    }

    if (!bestBlob) throw new Error("Compression failed. Please try another image.");
    onProgress({ phase: "done", percent: 100 });

    return {
      blob: bestBlob,
      width: bestCanvas.width,
      height: bestCanvas.height,
      quality: bestQuality,
      reachedTarget: reachedTarget && bestBlob.size <= targetBytes,
      targetBytes
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
