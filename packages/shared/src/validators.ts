import { z } from 'zod';

/** Iranian mobile: 09XXXXXXXXX (11 digits) — also accepts +989... */
export function isValidIranianMobile(v: string): boolean {
  return /^(?:\+98|0098|0)?9\d{9}$/.test(v.replace(/[\s-]/g, ''));
}

export const iranianMobileSchema = z
  .string()
  .trim()
  .refine(isValidIranianMobile, 'شماره موبایل ایران معتبر نیست (مثال: 09123456789)');

/** Normalize mobile to 09XXXXXXXXX form. */
export function normalizeIranianMobile(v: string): string {
  let s = v.replace(/[\s-]/g, '');
  if (s.startsWith('+98')) s = '0' + s.slice(3);
  else if (s.startsWith('0098')) s = '0' + s.slice(4);
  return s;
}

/** Iranian postal code: 10 digits, hyphens tolerated. */
export function isValidIranianPostalCode(v: string): boolean {
  return /^\d{10}$/.test(v.replace(/[-\s]/g, ''));
}

export const iranianPostalCodeSchema = z
  .string()
  .trim()
  .refine(isValidIranianPostalCode, 'کد پستی باید ۱۰ رقم باشد');

export function normalizePostalCode(v: string): string {
  return v.replace(/[-\s]/g, '');
}

/** Landline-ish phone (optional field on settings): 0XX-XXXXXXX */
export function isValidIranianLandline(v: string): boolean {
  return /^(?:\+98|0)\d{10,11}$/.test(v.replace(/[-\s()]/g, ''));
}

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9\u0600-\u06FF]+(?:[-_][a-z0-9\u0600-\u06FF]+)*$/, 'نامک (slug) نامعتبر است');

export const skuSchema = z
  .string()
  .trim()
  .min(2, 'حداقل ۲ نویسه')
  .max(64)
  .regex(/^[A-Za-z0-9._-]+$/, 'SKU فقط حروف لاتین، رقم، نقطه، خط تیره و زیرخط');

export const emailSchema = z.string().trim().email('ایمیل معتبر نیست').max(254);

export const passwordSchema = z
  .string()
  .min(10, 'رمز عبور حداقل ۱۰ نویسه')
  .max(128)
  .regex(/[A-Za-z]/, 'حداقل یک حرف')
  .regex(/\d/, 'حداقل یک رقم');

export const quantitySchema = z.number().int().min(1, 'حداقل ۱ عدد').max(999, 'حداکثر ۹۹۹ عدد در هر قلم');

export const productNameSchema = z.string().trim().min(2, 'نام کالا کوتاه است').max(200);
export const descriptionSchema = z.string().trim().min(10, 'توضیح کوتاه‌تر از حد مجاز').max(20000);

/** Iranian provinces (standard list — editable data lives in DB/settings later). */
export const IRAN_PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام', 'بوشهر',
  'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی', 'خراسان شمالی',
  'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'قزوین', 'قم', 'کردستان',
  'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان', 'لرستان',
  'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
] as const;

export const provinceSchema = z.enum(IRAN_PROVINCES as unknown as [string, ...string[]], 'استان نامعتبر است');
