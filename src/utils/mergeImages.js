import { canvasToBlob, loadImage } from "./imageHelpers";

export async function mergeImages(frontFile, backFile, layout = "horizontal") {
  const [frontLoaded, backLoaded] = await Promise.all([
    loadImage(frontFile),
    loadImage(backFile)
  ]);

  try {
    const first = frontLoaded.image;
    const second = backLoaded.image;
    const maxDimension = 6000;

    let canvas;
    if (layout === "vertical") {
      const width = Math.max(first.naturalWidth, second.naturalWidth);
      const scale = Math.min(1, maxDimension / width, maxDimension / (first.naturalHeight + second.naturalHeight));
      const w = Math.round(width * scale);
      const h1 = Math.round(first.naturalHeight * (w / first.naturalWidth));
      const h2 = Math.round(second.naturalHeight * (w / second.naturalWidth));
      canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h1 + h2;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(first, 0, 0, w, h1);
      ctx.drawImage(second, 0, h1, w, h2);
    } else {
      const height = Math.max(first.naturalHeight, second.naturalHeight);
      const scale = Math.min(1, maxDimension / height, maxDimension / (first.naturalWidth + second.naturalWidth));
      const h = Math.round(height * scale);
      const w1 = Math.round(first.naturalWidth * (h / first.naturalHeight));
      const w2 = Math.round(second.naturalWidth * (h / second.naturalHeight));
      const totalWidth = Math.min(maxDimension, w1 + w2);
      canvas = document.createElement("canvas");
      canvas.width = totalWidth;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(first, 0, 0, w1, h);
      ctx.drawImage(second, w1, 0, Math.max(1, totalWidth - w1), h);
    }

    const blob = await canvasToBlob(canvas, "image/jpeg", 0.94);
    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    URL.revokeObjectURL(frontLoaded.url);
    URL.revokeObjectURL(backLoaded.url);
  }
}
