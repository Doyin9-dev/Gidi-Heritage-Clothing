// Only files explicitly supplied in src/uploads/ are eligible for display.
const files = import.meta.glob([
  './uploads/{lagos-campaign,atelier,gh-tank-white,gh-tank-black,gh-ringer-white,gh-ringer-black}.{avif,jpeg,jpg,png,webp}',
  './uploads/logo.{avif,jpeg,jpg,png,svg,webp}',
], { eager: true, import: 'default', query: '?url' });

const extensions = ['svg', 'webp', 'avif', 'png', 'jpg', 'jpeg'];

export function uploadedMedia(slot) {
  for (const extension of extensions) {
    const url = files[`./uploads/${slot}.${extension}`];
    if (url) return url;
  }
  return null;
}
