import { z } from 'zod';

/** Money in the system is stored as a non-negative/signed integer in RIAL. */
export const rialAmountSchema = z
  .number()
  .int('مبلغ باید عدد صحیح است')
  .min(0, 'مبلغ نمی‌تواند منفی باشد')
  .max(1_000_000_000_000, 'مبلغ بیش از حد مجاز است');

export type Rial = number & { __rialBrand?: never };

/** Convert Rial -> Toman (explicit; never done silently). */
export function rialToToman(rial: number): number {
  return Math.round(rial / 10);
}

/** Convert Toman -> Rial (explicit). */
export function tomanToRial(toman: number): number {
  return Math.round(toman * 10);
}

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Convert ASCII digits inside a string to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => faDigits[Number(d)] ?? d);
}

/** Group an integer with thousands separators (comma, then optionally persify). */
export function groupThousands(n: number): string {
  return Math.trunc(n).toLocaleString('en-US');
}

/**
 * Format an integer RIAL amount for display.
 * displayCurrency 'toman' divides by 10 explicitly; 'rial' shows as-is.
 */
export function formatPrice(
  rial: number,
  opts: { displayCurrency?: 'toman' | 'rial'; persianDigits?: boolean } = {},
): string {
  const currency = opts.displayCurrency ?? 'toman';
  const value = currency === 'toman' ? rialToToman(rial) : rial;
  let text = groupThousands(value);
  if (opts.persianDigits !== false) text = toPersianDigits(text);
  const unit = currency === 'toman' ? 'تومان' : 'ریال';
  return `${text} ${unit}`;
}

/** Apply a percentage discount to a price (integer rial, rounded down). */
export function applyPercentDiscount(priceRial: number, percent: number): number {
  if (percent <= 0) return priceRial;
  if (percent >= 100) return 0;
  return Math.floor(priceRial - (priceRial * percent) / 100);
}

/** Clamp helper used across pricing logic. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
