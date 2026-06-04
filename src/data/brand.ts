/** Zen Convention brand assets (served from /public/brand). */
export const BRAND_LOGOS = {
  zen: '/brand/zen-logo.svg',
  horizontal: '/brand/logo-horizontal.svg',
  vertical: '/brand/logo-vertical.svg',
  emblem: '/brand/emblem.svg',
} as const;

export type BrandLogoVariant = keyof typeof BRAND_LOGOS;
