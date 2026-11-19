// Hochgeladenes Foto verkleinern (max. 1600 px) und als JPEG-Data-URL zurückgeben – spart Speicher und Ladezeit.
export async function fileToJpeg(file, max = 1600) {
  if (!file?.type?.startsWith('image/')) throw new Error('Bitte ein Bild wählen (JPG, PNG oder WebP).');
  if (file.size > 15 * 1024 * 1024) throw new Error('Das Bild ist zu gross (max. 15 MB).');
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  return c.toDataURL('image/jpeg', 0.88);
}
