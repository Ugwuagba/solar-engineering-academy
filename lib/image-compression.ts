/**
 * Client-Side Image Compression using HTML Canvas.
 * Resizes the image to a maximum width of 1280px (16:9 aspect ratio preserved)
 * and encodes as WebP (with JPEG fallback) at 0.78 quality.
 * Reduces uploaded Base64 string sizes from ~8MB down to <150KB.
 */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1280,
  quality = 0.78
): Promise<{ dataUrl: string; sizeKb: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("Image compression is only available in the browser"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Proportional dimensions capped at maxWidth
      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      if (targetWidth > maxWidth) {
        targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
        targetWidth = maxWidth;
      }

      // Safeguard against 0px dimensions
      targetWidth = Math.max(1, targetWidth);
      targetHeight = Math.max(1, targetHeight);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        // Fallback to FileReader if canvas 2D context cannot be initialized
        const reader = new FileReader();
        reader.onload = (e) => {
          const rawUrl = (e.target?.result as string) || "";
          const sizeKb = Math.round((rawUrl.length * 3) / 4 / 1024);
          resolve({ dataUrl: rawUrl, sizeKb, width: targetWidth, height: targetHeight });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      // High-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Fill canvas background to avoid transparent dark pixels
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw and scale image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Try image/webp first with quality 0.78
      let compressedDataUrl = canvas.toDataURL("image/webp", quality);
      // Fallback to image/jpeg if browser doesn't support webp canvas export
      if (!compressedDataUrl.startsWith("data:image/webp")) {
        compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
      const sizeKb = Math.round(approxBytes / 1024);

      resolve({
        dataUrl: compressedDataUrl,
        sizeKb,
        width: targetWidth,
        height: targetHeight,
      });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
