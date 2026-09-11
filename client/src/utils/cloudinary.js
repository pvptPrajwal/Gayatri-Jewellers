/**
 * Inserts Cloudinary transformation parameters into an existing Cloudinary
 * image URL, so the browser downloads a resized/compressed version instead
 * of the original full-size upload.
 *
 * A Cloudinary URL looks like:
 *   https://res.cloudinary.com/<cloud>/image/upload/v169.../folder/file.jpg
 * Transformations go right after "/upload/":
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_400/v169.../folder/file.jpg
 *
 * - f_auto -> serves WebP/AVIF automatically where the browser supports it
 * - q_auto -> Cloudinary picks the best quality/size tradeoff
 * - w_<n>  -> caps the width so we never ship a bigger image than needed
 *
 * If the URL isn't a Cloudinary URL (e.g. a local placeholder), it's
 * returned unchanged so nothing breaks.
 */
export const optimizedImage = (url, width) => {
  if (!url) return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transforms = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
  return url.replace('/upload/', `/upload/${transforms}/`);
};
