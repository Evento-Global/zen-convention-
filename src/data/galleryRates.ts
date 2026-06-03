import { RATE_MARKUP_INR } from '../utils/pricing';

/**
 * Base rates (INR) keyed by gallery option id and 1-based REF index.
 * Sourced from repo-root `Zen convention rate /` reference screenshots.
 * Site displays base + RATE_MARKUP_INR (see utils/pricing.ts).
 */
export type GalleryRateMap = Readonly<Record<number, number>>;

export const GALLERY_BASE_RATES: Readonly<Record<string, GalleryRateMap>> = {
  'haldi-traditional': {
    1: 40_000,
    2: 130_000,
    3: 100_000,
    4: 120_000,
    5: 200_000,
    6: 80_000,
    7: 80_000,
    8: 170_000,
    9: 100_000,
    10: 200_000,
    11: 150_000,
    12: 130_000,
    13: 200_000,
    14: 170_000,
    15: 100_000,
    16: 80_000,
    17: 100_000,
    18: 120_000,
    19: 140_000,
    20: 120_000,
    21: 140_000,
    22: 90_000,
    23: 120_000,
    24: 80_000,
    25: 130_000,
    26: 110_000,
    27: 130_000,
    28: 185_000,
    29: 120_000,
    30: 80_000,
    31: 120_000,
    32: 190_000,
    33: 140_000,
    34: 90_000,
    35: 120_000,
    36: 180_000,
    37: 130_000,
    40: 140_000,
  },
  'mehendi-traditional': {
    1: 80_000,
    2: 130_000,
    3: 180_000,
    4: 120_000,
    5: 100_000,
    6: 160_000,
    7: 75_000,
    8: 135_000,
    9: 145_000,
    10: 145_000,
    11: 165_000,
    12: 110_000,
    13: 75_000,
    14: 120_000,
    15: 100_000,
    16: 145_000,
    17: 110_000,
    18: 100_000,
    19: 155_000,
  },
  'pellikuturu-traditional': {
    1: 95_000,
    2: 200_000,
    3: 130_000,
    4: 180_000,
    5: 100_000,
    6: 130_000,
    7: 200_000,
    8: 180_000,
    9: 130_000,
    10: 200_000,
    11: 180_000,
    12: 220_000,
    13: 150_000,
    14: 130_000,
    15: 220_000,
    16: 110_000,
    17: 210_000,
    18: 200_000,
    19: 180_000,
    20: 130_000,
    21: 150_000,
    22: 190_000,
    25: 150_000,
    26: 190_000,
    27: 250_000,
    28: 200_000,
    29: 230_000,
    30: 200_000,
    31: 110_000,
    32: 120_000,
    33: 220_000,
    34: 155_000,
    35: 180_000,
    36: 120_000,
    37: 160_000,
    38: 200_000,
    39: 190_000,
    40: 170_000,
    41: 170_000,
  },
} as const;

/** 1-based REF → base INR, or undefined if not priced yet. */
export function getGalleryBaseRate(optionId: string, refIndex: number): number | undefined {
  const map = GALLERY_BASE_RATES[optionId];
  if (!map) return undefined;
  return map[refIndex];
}

/** Lowest listed price for an option (for flip-card summary). */
export function getOptionFromListedPrice(optionId: string): number | undefined {
  const map = GALLERY_BASE_RATES[optionId];
  if (!map) return undefined;
  const bases = Object.values(map);
  if (bases.length === 0) return undefined;
  return Math.min(...bases) + RATE_MARKUP_INR;
}
