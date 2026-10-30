/**
 * Jalali (Persian) calendar conversion.
 * TypeScript port of the reference `jalaali-js` algorithm by Behrang Norouzi
 * (MIT License), using the official 33-year arithmetic break-point table.
 */

const BREAKS: number[] = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
  2192, 2262, 2324, 2394, 2456, 2518, 2600, 2637, 2716, 2749, 2786, 2829,
  2906, 2933, 2979, 3006, 3033, 3070, 3097, 3134, 3153, 3238, 3265, 3283,
  3299, 3357, 3369, 3378, 3386, 3399, 3419, 3447, 3469, 3482, 3493, 3531,
  3547, 3560, 3591, 3619, 3646, 3683, 3713, 3756, 3768, 3788, 3820, 3847,
  3872, 3890, 3911, 3944, 3972, 4000, 4043, 4056, 4083, 4086, 4103, 4152,
  4177, 4186, 4197, 4208, 4216, 4225, 4233, 4242, 4253, 4270, 4292, 4293,
  4295, 4325, 4336, 4348, 4361, 4368, 4376, 4385, 4393, 4398, 4401, 4411,
  4420, 4426, 4430, 4441, 4447, 4449, 4450, 4451, 4456, 4469, 4487, 4495,
  4500, 4508, 4519, 4523, 4525, 4526, 4527, 4529, 4530, 4531, 4534, 4538,
  4543, 4547, 4556, 4560, 4563, 4564, 4565, 4566, 4568, 4569, 4570, 4571,
  4573, 4574, 4575, 4576, 4577, 4578, 4580, 4581, 4583, 4584, 4585, 4586,
  4587, 4588, 4590, 4591, 4592, 4594, 4595, 4596, 4598, 4600, 4601, 4602,
  4604, 4605, 4606, 4607, 4608, 4610, 4611, 4612,
];

function div(a: number, b: number): number {
  return ~~(a / b);
}

function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

interface JalCalOut { jy: number; leap: number; gy: number; march: number }

/** jalaali-js jalCal(jy) — line-by-line port. */
function jalCal(jy: number): JalCalOut {
  let bl = BREAKS[0] as number; // -61
  let leapJ = -14;
  let gp = -1;
  let march = 20;
  for (let j = 1; j < BREAKS.length; j++) {
    const bj = BREAKS[j];
    if (bj === undefined) break;
    if (jy < bl) break;
    const current = bj - bl;
    const nLeaps = div(current, 33) * 4 + div(mod(current, 33), 4);
    gp += nLeaps;
    if (mod(jy - bl, current) > current - 1) { bl = bj; continue; }
    leapJ = gp + div(mod(jy - bl, current), 4);
    march = bj === 1029 ? 21 : 20;
    break;
  }

  const gy = jy + 621;
  const leapG = div(gy, 4) - div((div(gy, 33) + 2) * div(gy, 132), 4) - 1;
  march = 20 + leapJ - leapG;

  // Find how many years have passed since the last leap year
  if (jy - bl < 6) {
    let n = jy - bl + 1;
    if (n < 1) n -= 66;
    leapJ = leapJ - div(n, 4) + 1;
    if (mod(n, 4) === 1) leapJ -= 2;
    leapJ += div(n, 33) * 4;
    leapJ += div(mod(n, 33) + 3, 4);
  }

  void gp;
  return { jy, leap: leapJ, gy, march };
}

/** jalaali-js j2d(jy,jm,jd) */
function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

/** jalaali-js d2j(dn) */
function d2j(dn: number): { jy: number; jm: number; jd: number } {
  const gy0 = dn < g2d(586, 3, 21) ? 585 : 621;
  const gy = gy0 + div(dn - g2d(gy0, 3, 21), 365);
  let jy = gy - 621;
  let r = jalCal(jy);
  let jdn1f = g2d(gy, 3, r.march);
  let k = dn - jdn1f;
  if (k < 0) {
    jy -= 1;
    r = jalCal(jy);
    jdn1f = g2d(r.gy, 3, r.march);
    k = dn - jdn1f;
  }
  let jm: number;
  let jd: number;
  if (k <= 185) {
    jm = 1 + div(k, 31);
    jd = mod(k, 31) + 1;
    return { jy, jm, jd };
  }
  k -= 186;
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

/** jalaali-js g2d — Gregorian to absolute day number. */
function g2d(gy: number, gm: number, gd: number): number {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5)
    + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

/** jalaali-js d2g — absolute day number to Gregorian. */
function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

export function gregorianToJalali(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
  return d2j(g2d(gy, gm, gd));
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  return d2g(j2d(jy, jm, jd));
}

/** True when Jalali year jy is a leap year (jalaali-js isLeapJalaaliYear). */
export function isLeapJalaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

const JM_NAMES = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export function jalaliMonthName(jm: number): string {
  return JM_NAMES[jm - 1] ?? '';
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigitsInText(s: string): string {
  return s.replace(/\d/g, (c) => FA_DIGITS[Number(c)] ?? c);
}

/** Format a Date or ISO string as "۱۲ دی ۱۴۰۳" (optionally with time). */
export function formatJalaliDate(
  iso: string | Date,
  opts: { persianDigits?: boolean; time?: boolean } = {},
): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const { jy, jm, jd } = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  let s = `${jd} ${jalaliMonthName(jm)} ${jy}`;
  if (opts.time) {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    s += `، ${hh}:${mm}`;
  }
  if (opts.persianDigits !== false) s = toPersianDigitsInText(s);
  return s;
}
