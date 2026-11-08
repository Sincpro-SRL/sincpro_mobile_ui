import { Big } from "big.js";

export function parseToMonetaryNumber(input?: string | number | null): number {
  if (input == null) return 0;
  // A finite number is already a number: skip the string round trip, which also
  // misread exponent forms (1e21 → "121").
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  const s = String(input).trim();
  if (!/[0-9]/.test(s)) return 0;

  const cleaned = s.replace(/[^0-9.-]+/g, "");
  try {
    return Number(new Big(cleaned).toString());
  } catch {
    return 0;
  }
}

// Building an Intl formatter is the expensive part (locale data lookup); format()
// is cheap. One shared instance for every amount the app renders.
const TWO_DECIMALS = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `1234.5` → `"1.234,50"`. Rounds half-up in decimal (Big), not in binary floating point. */
export function formatTwoDecimals(value?: number | string | null): string {
  const rounded = new Big(parseToMonetaryNumber(value)).toFixed(2);
  return TWO_DECIMALS.format(Number(rounded));
}

export function calculateDiscountedTotal(total: number, discount: number): number {
  if (discount === 0) {
    return 0;
  }

  const result = (parseToMonetaryNumber(total) * discount) / 100;
  return parseToMonetaryNumber(result);
}
