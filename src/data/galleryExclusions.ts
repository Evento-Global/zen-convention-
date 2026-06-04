/**
 * 1-based REF indices to hide from the public gallery (marked X on rate sheets).
 * Original REF numbers are preserved for priced items.
 */
export const GALLERY_EXCLUDED_REFS: Readonly<Record<string, ReadonlySet<number>>> = {
  'mehendi-contemporary': new Set([
    2, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25, 27, 28, 29, 30, 32, 34, 37,
    38, 41, 42, 45, 51, 52, 53, 55, 57,
  ]),
  'cradle-birthday-contemporary': new Set([5, 8, 10, 11, 38]),
};
