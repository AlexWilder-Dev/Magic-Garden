import { OPEN_MIN, closeMinFor } from '../data/venue';

/** A calendar date in London, YYYY-MM-DD. All venue logic runs on London wall-clock time. */
export type DateKey = string;

export interface Wall {
  key: DateKey;
  /** Minutes after midnight, 0–1439. */
  min: number;
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const pad = (n: number) => String(n).padStart(2, '0');

export const keyOf = (y: number, m: number, d: number): DateKey => `${y}-${pad(m)}-${pad(d)}`;

export function partsOf(key: DateKey) {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m, d };
}

const utc = (key: DateKey) => {
  const { y, m, d } = partsOf(key);
  return Date.UTC(y, m - 1, d);
};

export function addDays(key: DateKey, n: number): DateKey {
  const t = new Date(utc(key) + n * 86400000);
  return keyOf(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

export const dowOf = (key: DateKey) => new Date(utc(key)).getUTCDay();
export const daysBetween = (a: DateKey, b: DateKey) => Math.round((utc(b) - utc(a)) / 86400000);

export function londonNow(date = new Date()): Wall {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { key: `${p.year}-${p.month}-${p.day}`, min: (Number(p.hour) % 24) * 60 + Number(p.minute) };
}

/**
 * Demo override. Accepts `fri-21:30` (the next Friday from today, today included)
 * or `2026-10-16T21:30` (London time).
 */
export function parseAt(raw: string | null | undefined, today: Wall): Wall | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  const day = s.match(/^(sun|mon|tue|wed|thu|fri|sat)[a-z]*[-\s@t]?(\d{1,2})(?::?(\d{2}))?$/);
  if (day) {
    const h = Number(day[2]);
    const mi = Number(day[3] ?? 0);
    if (h > 23 || mi > 59) return null;
    const delta = (DAY_KEYS.indexOf(day[1]) - dowOf(today.key) + 7) % 7;
    return { key: addDays(today.key, delta), min: h * 60 + mi };
  }
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[t\s](\d{1,2}):(\d{2}))?/);
  if (iso) {
    const [y, m, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
    const h = Number(iso[4] ?? 12);
    const mi = Number(iso[5] ?? 0);
    if (m < 1 || m > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
    return { key: keyOf(y, m, d), min: h * 60 + mi };
  }
  return null;
}

export type Phase = 'day' | 'evening' | 'late' | 'closed';

export interface Status {
  open: boolean;
  /** The trading day this moment belongs to: 1am on a Saturday still counts as Friday night. */
  night: DateKey;
  /** Minutes into that trading day (can pass 1440 after midnight). */
  nightMin: number;
  closeMin: number;
  phase: Phase;
}

export function statusAt(now: Wall): Status {
  const prev = addDays(now.key, -1);
  const prevClose = closeMinFor(dowOf(prev));
  if (now.min < prevClose - 1440) {
    return { open: true, night: prev, nightMin: now.min + 1440, closeMin: prevClose, phase: 'late' };
  }
  const closeMin = closeMinFor(dowOf(now.key));
  if (now.min >= OPEN_MIN) {
    return { open: true, night: now.key, nightMin: now.min, closeMin, phase: now.min < 17 * 60 ? 'day' : 'evening' };
  }
  return { open: false, night: now.key, nightMin: now.min, closeMin, phase: 'closed' };
}

export function fmtTime(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  if (m === 0) return 'midnight';
  if (m === 720) return '12pm';
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${mm ? `:${pad(mm)}` : ''}${h < 12 ? 'am' : 'pm'}`;
}

export function fmtRange(start: number | null, end: number): string {
  if (start === null) return `Till ${fmtTime(end)}`;
  const s = fmtTime(start);
  const e = fmtTime(end);
  // 7:30–11:30pm reads better than 7:30pm–11:30pm
  if (s.endsWith('pm') && e.endsWith('pm')) return `${s.slice(0, -2)}–${e}`;
  return `${s}–${e}`;
}

export const tillLabel = (closeMin: number) => `till ${fmtTime(closeMin)}`;

export function fmtDay(key: DateKey, opts: { long?: boolean; year?: boolean } = {}) {
  const { y, m, d } = partsOf(key);
  const dow = dowOf(key);
  if (opts.long) return `${DAY_LONG[dow]} ${d} ${MONTH_LONG[m - 1]}${opts.year ? ` ${y}` : ''}`;
  return `${DAY_SHORT[dow]} ${d} ${MONTH_SHORT[m - 1]}`;
}

export const dayShort = (key: DateKey) => DAY_SHORT[dowOf(key)];
export const dayLong = (key: DateKey) => DAY_LONG[dowOf(key)];
export const dayNum = (key: DateKey) => partsOf(key).d;
export const monthShort = (key: DateKey) => MONTH_SHORT[partsOf(key).m - 1];

/** "tonight", "tomorrow", "Thursday", or "Thu 22 Oct" beyond a week. */
export function relDay(from: DateKey, to: DateKey): string {
  const n = daysBetween(from, to);
  if (n === 0) return 'tonight';
  if (n === 1) return 'tomorrow';
  if (n > 1 && n < 7) return DAY_LONG[dowOf(to)];
  return fmtDay(to);
}
