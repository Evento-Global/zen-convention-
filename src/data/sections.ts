import { OPTION_GALLERY_URLS, SECTION_COVER_URL } from './photoManifest.generated';
import { buildGalleryItems, type GalleryItem } from './galleryItems';
import { picsumPlaceholderUrl } from './mediaUrls';

export type SectionId =
  | 'haldi'
  | 'pellikuturu'
  | 'mehendi'
  | 'sangeet'
  | 'wedding'
  | 'reception'
  | 'cradle-birthday';

export { resolveImageSrc, picsumPlaceholderUrl } from './mediaUrls';

/** @deprecated use `picsumPlaceholderUrl` */
export const dummyImageUrl = picsumPlaceholderUrl;

export interface EventStyleOption {
  readonly id: string;
  readonly label: string;
  /** Local `/photos/…` paths and/or Picsum seed strings (reception placeholders). */
  readonly galleryRefs: readonly GalleryItem[];
}

export interface EventSection {
  readonly id: SectionId;
  readonly title: string;
  readonly blurb: string;
  readonly styleOptions: readonly EventStyleOption[];
  /** Fallback Picsum chapter key (e.g. reception until real photos exist). */
  readonly imageSeed: string;
  /** Home card hero — first real photo when available. */
  readonly coverImageSrc?: string;
}

/** Placeholder gallery slots when a folder is missing (not used for wired options). */
function picsumGallery(prefix: string, count: number): readonly string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}-${i + 1}`);
}

function galleryForOption(
  optionId: string,
  picsumPrefix: string,
  count = 12,
): readonly GalleryItem[] {
  const pack = OPTION_GALLERY_URLS[optionId as keyof typeof OPTION_GALLERY_URLS];
  const urls =
    pack && pack.length > 0 ? pack : picsumGallery(picsumPrefix, count);
  return buildGalleryItems(optionId, urls);
}

function coverForSection(sectionId: SectionId): string | undefined {
  if (!(sectionId in SECTION_COVER_URL)) return undefined;
  return SECTION_COVER_URL[sectionId as keyof typeof SECTION_COVER_URL];
}

export const EVENT_SECTIONS: readonly EventSection[] = [
  {
    id: 'haldi',
    title: 'Haldi',
    blurb: 'Sun-kissed palettes, floral textures, and joyful energy.',
    styleOptions: [
      {
        id: 'haldi-traditional',
        label: 'Traditional',
        galleryRefs: galleryForOption('haldi-traditional', 'haldi-traditional'),
      },
      {
        id: 'haldi-contemporary',
        label: 'Contemporary',
        galleryRefs: galleryForOption('haldi-contemporary', 'haldi-contemporary'),
      },
    ],
    imageSeed: 'haldi-evento',
    coverImageSrc: coverForSection('haldi'),
  },
  {
    id: 'pellikuturu',
    title: 'Pellikuturu / Pellikoduku',
    blurb: 'Bridal rituals and family warmth — thoughtfully staged.',
    styleOptions: [
      {
        id: 'pellikuturu-traditional',
        label: 'Traditional',
        galleryRefs: galleryForOption('pellikuturu-traditional', 'pellikuturu-traditional'),
      },
    ],
    imageSeed: 'pellikuturu-evento',
    coverImageSrc: coverForSection('pellikuturu'),
  },
  {
    id: 'mehendi',
    title: 'Mehendi',
    blurb: 'Patterns, lounges, and color — layered for comfort and flair.',
    styleOptions: [
      {
        id: 'mehendi-traditional',
        label: 'Traditional',
        galleryRefs: galleryForOption('mehendi-traditional', 'mehendi-traditional'),
      },
      {
        id: 'mehendi-contemporary',
        label: 'Contemporary',
        galleryRefs: galleryForOption('mehendi-contemporary', 'mehendi-contemporary'),
      },
    ],
    imageSeed: 'mehendi-evento',
    coverImageSrc: coverForSection('mehendi'),
  },
  {
    id: 'sangeet',
    title: 'Sangeet',
    blurb: 'Music, lights, and movement — built for the big night.',
    styleOptions: [
      {
        id: 'sangeet-led',
        label: 'With LED',
        galleryRefs: galleryForOption('sangeet-led', 'sangeet-led'),
      },
      {
        id: 'sangeet-structure',
        label: 'With structure',
        galleryRefs: galleryForOption('sangeet-structure', 'sangeet-structure'),
      },
    ],
    imageSeed: 'sangeet-evento',
    coverImageSrc: coverForSection('sangeet'),
  },
  {
    id: 'wedding',
    title: 'Wedding',
    blurb: 'The main moment — curated with tradition and grace.',
    styleOptions: [
      {
        id: 'wedding-traditional',
        label: 'Traditional',
        galleryRefs: galleryForOption('wedding-traditional', 'wedding-traditional'),
      },
      {
        id: 'wedding-contemporary',
        label: 'Contemporary',
        galleryRefs: galleryForOption('wedding-contemporary', 'wedding-contemporary'),
      },
    ],
    imageSeed: 'wedding-evento',
    coverImageSrc: coverForSection('wedding'),
  },
  {
    id: 'reception',
    title: 'Reception',
    blurb: 'Statement structures and refined guest experiences.',
    styleOptions: [
      {
        id: 'reception-contemporary',
        label: 'Contemporary',
        galleryRefs: galleryForOption('reception-contemporary', 'reception-contemporary'),
      },
    ],
    imageSeed: 'reception-evento',
    coverImageSrc: coverForSection('reception'),
  },
  {
    id: 'cradle-birthday',
    title: 'Cradle / Birthday',
    blurb: 'Playful milestones and gatherings for the smallest guests of honor.',
    styleOptions: [
      {
        id: 'cradle-birthday-contemporary',
        label: 'Contemporary',
        galleryRefs: galleryForOption('cradle-birthday-contemporary', 'cradle-birthday-contemporary'),
      },
    ],
    imageSeed: 'cradle-birthday-evento',
    coverImageSrc: coverForSection('cradle-birthday'),
  },
] as const;

export interface ResolvedStyleOption {
  readonly section: EventSection;
  readonly option: EventStyleOption;
}

/** Old slugs → current option ids (bookmarks / shared links). */
export const LEGACY_OPTION_IDS: Readonly<Record<string, string>> = {
  'haldi-semi-traditional-contemporary': 'haldi-contemporary',
  'mehendi-semi-traditional-contemporary': 'mehendi-contemporary',
  'wedding-semi-traditional': 'wedding-contemporary',
};

/** Resolve gallery route slug (e.g. `/products/haldi-traditional`). */
export function resolveCanonicalOptionId(optionId: string): string {
  const trimmed = optionId.trim();
  return LEGACY_OPTION_IDS[trimmed] ?? trimmed;
}

/** Resolve gallery route slug (e.g. `/products/haldi-traditional`). */
export function resolveProductGallery(optionId: string): ResolvedStyleOption | null {
  const canonical = resolveCanonicalOptionId(optionId);
  if (!canonical) return null;
  for (const section of EVENT_SECTIONS) {
    const match = section.styleOptions.find((o) => o.id === canonical);
    if (match) return { section, option: match };
  }
  return null;
}
