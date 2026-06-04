import { GALLERY_EXCLUDED_REFS } from './galleryExclusions';

export interface GalleryItem {
  readonly url: string;
  /** 1-based REF index matching internal rate sheets (stable after exclusions). */
  readonly ref: number;
}

export function buildGalleryItems(
  optionId: string,
  urls: readonly string[],
): readonly GalleryItem[] {
  const excluded = GALLERY_EXCLUDED_REFS[optionId];
  return urls
    .map((url, index) => ({ url, ref: index + 1 }))
    .filter((item) => !excluded?.has(item.ref));
}
