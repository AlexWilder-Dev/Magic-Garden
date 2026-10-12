import { EVENTS, patternEvent, type GigEvent } from '../data/events';
import { addDays, dowOf, type DateKey, type Status } from './time';

export interface Night {
  key: DateKey;
  dow: number;
  event: GigEvent | null;
}

export const eventForNight = (key: DateKey): GigEvent | null =>
  EVENTS.find((e) => e.date === key) ?? patternEvent(key);

export function nightsFrom(start: DateKey, count: number): Night[] {
  return Array.from({ length: count }, (_, i) => {
    const key = addDays(start, i);
    return { key, dow: dowOf(key), event: eventForNight(key) };
  });
}

/** Nights from tonight to the last dated event, and never fewer than `min`. */
export function programmeFrom(start: DateKey, min = 14): Night[] {
  const last = EVENTS.reduce((acc, e) => (e.date > acc ? e.date : acc), start);
  let count = min;
  while (addDays(start, count - 1) < last) count++;
  return nightsFrom(start, count);
}

export type ShowState = 'upcoming' | 'on' | 'done';

export function showState(e: GigEvent, status: Status): ShowState {
  if (status.night !== e.date) return status.night < e.date ? 'upcoming' : 'done';
  const t = status.nightMin;
  if (t >= e.end) return 'done';
  if (e.start !== null && t >= e.start) return 'on';
  return 'upcoming';
}

/** The next show that hasn't finished, starting with the current trading day. */
export type Show = Night & { event: GigEvent };

export function nextShow(status: Status, opts: { skipTonight?: boolean } = {}): Show | null {
  for (let i = 0; i < 60; i++) {
    const key = addDays(status.night, i);
    if (i === 0 && opts.skipTonight) continue;
    const event = eventForNight(key);
    if (!event) continue;
    if (i === 0 && showState(event, status) === 'done') continue;
    return { key, dow: dowOf(key), event };
  }
  return null;
}
