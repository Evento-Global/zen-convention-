/** Internal adjustment applied when computing listed gallery prices (INR). */
export const RATE_MARKUP_INR = 30_000;

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** Format whole rupees for display (e.g. ₹1,80,000). */
export function formatInr(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

export function listedPriceInr(baseInr: number): number {
  return baseInr + RATE_MARKUP_INR;
}

export function formatListedPrice(baseInr: number): string {
  return formatInr(listedPriceInr(baseInr));
}
