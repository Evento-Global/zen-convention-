/** Remote placeholder (Picsum) from deterministic seed — used when no real asset exists. */
export function picsumPlaceholderUrl(seed: string, width = 960, height = 640): string {
  const safe = encodeURIComponent(seed);
  return `https://picsum.photos/seed/${safe}/${width}/${height}`;
}

/**
 * Returns a usable `src`:
 * • `/photos/…` — local files from `public/photos`
 * • `http(s)://…` — remote
 * • anything else — treated as a Picsum seed (legacy / reception fallback).
 */
export function resolveImageSrc(ref: string, width = 960, height = 640): string {
  const v = ref.trim();
  if (!v) return '';
  if (v.startsWith('/')) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return picsumPlaceholderUrl(v, width, height);
}
