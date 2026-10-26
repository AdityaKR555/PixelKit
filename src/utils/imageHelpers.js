// export function loadImage(file) {
//   return new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(file);
//     const image = new Image();
//     image.onload = () => resolve({ image, url });
//     image.onerror = () => {
//       URL.revokeObjectURL(url);
//       reject(new Error("This image could not be opened. Try another file."));
//     };
//     image.src = url;
//   });
// }

// export function canvasToBlob(canvas, type, quality) {
//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (blob) resolve(blob);
//       else reject(new Error("Could not export this image. Try a different format."));
//     }, type, quality);
//   });
// }

// export function downloadBlob(blob, filename) {
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   setTimeout(() => URL.revokeObjectURL(url), 1000);
// }



export function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Please select an image first."));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
    };

    image.onload = () => {
      cleanup();
      resolve({
        image,
        url: objectUrl,
        sourceBlob: file,
      });
    };

    image.onerror = async () => {
      cleanup();

      // Fallback: try reading the selected file as a data URL.
      URL.revokeObjectURL(objectUrl);

      try {
        const reader = new FileReader();

        reader.onload = () => {
          const fallbackImage = new Image();

          fallbackImage.onload = () => {
            resolve({
              image: fallbackImage,
              url: reader.result,
              sourceBlob: file,
            });
          };

          fallbackImage.onerror = () => {
            reject(
              new Error(
                "Could not open this image. Please try another JPG or PNG file."
              )
            );
          };

          fallbackImage.src = reader.result;
        };

        reader.onerror = () => {
          reject(new Error("Could not read the selected image."));
        };

        reader.readAsDataURL(file);
      } catch {
        reject(new Error("Could not open the selected image."));
      }
    };

    image.src = objectUrl;
  });
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not export this image."));
        }
      },
      type,
      quality
    );
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
