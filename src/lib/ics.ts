import { fullTitle, type GigEvent } from '../data/events';
import { addDays, partsOf, type DateKey } from './time';
import { VENUE } from '../data/venue';

const pad = (n: number) => String(n).padStart(2, '0');

function local(date: DateKey, min: number) {
  const key = min >= 1440 ? addDays(date, Math.floor(min / 1440)) : date;
  const m = min % 1440;
  const { y, m: mo, d } = partsOf(key);
  return `${y}${pad(mo)}${pad(d)}T${pad(Math.floor(m / 60))}${pad(m % 60)}00`;
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** Fold to 75 octets per RFC 5545, without splitting a UTF-8 character. */
function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    const limit = out.length ? 74 : 75;
    if (bytes + b > limit) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

const VTIMEZONE = [
  'BEGIN:VTIMEZONE', 'TZID:Europe/London',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0000', 'TZOFFSETTO:+0100', 'TZNAME:BST', 'DTSTART:19700329T010000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0000', 'TZNAME:GMT', 'DTSTART:19701025T020000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];

export function buildIcs(e: GigEvent): string | null {
  if (e.start === null) return null;
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//The Magic Garden//Line-up//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...VTIMEZONE,
    'BEGIN:VEVENT',
    `UID:${e.id}-${e.date}@magicgardenpub.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/London:${local(e.date, e.start)}`,
    `DTEND;TZID=Europe/London:${local(e.date, e.end)}`,
    `SUMMARY:${esc(`${fullTitle(e)} at The Magic Garden`)}`,
    `LOCATION:${esc(`The Magic Garden, ${VENUE.street}, ${VENUE.city}`)}`,
    `DESCRIPTION:${esc([...e.blurb, e.url ?? ''].filter(Boolean).join('\n'))}`,
    ...(e.url ? [`URL:${e.url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function downloadIcs(e: GigEvent) {
  const ics = buildIcs(e);
  if (!ics) return;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `magic-garden-${e.date}-${e.id.replace(/[^a-z0-9-]/gi, '')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
