import Sheet from './Sheet';
import Img, { type ImageName } from './Img';
import { useUI } from '../lib/ui';
import { useClock } from '../lib/clock';
import { fmtDay, fmtRange } from '../lib/time';
import { downloadIcs } from '../lib/ics';
import { showState } from '../lib/lineup';
import type { GigEvent } from '../data/events';
import { IconCalendar, IconExternal } from './Icons';

export function entryText(e: GigEvent): string {
  switch (e.entry.kind) {
    case 'free':
      return 'Free entry';
    case 'quiz':
      return 'Free entry · £2 per person to play';
    case 'tickets':
      return [e.entry.price ?? 'Tickets', e.entry.note].filter(Boolean).join(' · ');
    default:
      return 'Line-up and tickets to be announced';
  }
}

/** Short form for tight spots like the live strip. */
export function entryShort(e: GigEvent): string {
  if (e.entry.kind === 'quiz') return 'Free · £2 to play';
  if (e.entry.kind === 'tba') return 'Tickets tba';
  return entryText(e);
}

export const isTicketed = (e: GigEvent) => e.entry.kind === 'tickets' && !!e.url;

/** Pattern nights without a poster get a photo of the room instead. */
export function imageFor(e: GigEvent): { name: ImageName; poster: boolean } {
  if (e.image) return { name: e.image as ImageName, poster: true };
  return { name: e.tier === 'headline' ? 'home-3' : 'about-4', poster: false };
}

export default function EventSheet() {
  const { sheet, closeEvent } = useUI();
  return (
    <Sheet open={!!sheet} onClose={closeEvent} labelledBy="event-title" className="sheet--event">
      {sheet && <EventDetail night={sheet.night} event={sheet.event} />}
    </Sheet>
  );
}

function EventDetail({ night, event: e }: { night: string; event: GigEvent }) {
  const { status } = useClock();
  const { openBooking } = useUI();
  const img = imageFor(e);
  const state = showState(e, status);
  const isTonight = night === status.night;

  return (
    <article className="gig">
      <figure className={`gig__art ${img.poster ? 'is-poster' : 'is-room'}`}>
        <Img name={img.name} alt={img.poster ? `Poster for ${e.name}` : 'The stage at The Magic Garden'} sizes="(min-width: 760px) 560px, 92vw" />
        {!img.poster && <figcaption>Act to be announced. Here’s the room they’ll play.</figcaption>}
      </figure>
      <div className="gig__body">
        <p className="gig__when">
          {isTonight && <span className={`badge ${state === 'on' ? 'badge--live' : ''}`}>{state === 'on' ? 'On now' : state === 'done' ? 'Earlier tonight' : 'Tonight'}</span>}
          {fmtDay(night, { long: true })} · {fmtRange(e.start, e.end)}
        </p>
        {e.presenter && e.presenter !== e.name && <p className="gig__presenter">{e.presenter}</p>}
        <h2 id="event-title" tabIndex={-1} className={`gig__title ${e.tba ? 'is-tba' : ''}`}>
          {e.name}
          {e.origin && <span className="gig__origin"> ({e.origin})</span>}
        </h2>
        {e.support && <p className="gig__support">{e.support}</p>}
        <ul className="tags" aria-label="Genres">
          {e.genres.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <p className="gig__blurb">
          {e.blurb[0]}
          <br />
          {e.blurb[1]}
        </p>
        <p className="gig__entry">{entryText(e)}</p>
        <div className="gig__actions">
          {isTicketed(e) && (
            <a className="btn btn--red" href={e.url} target="_blank" rel="noopener noreferrer">
              Get tickets <IconExternal width={16} height={16} />
            </a>
          )}
          {!isTicketed(e) && e.url && (
            <a className="btn btn--ghost" href={e.url} target="_blank" rel="noopener noreferrer">
              Eventbrite listing <IconExternal width={16} height={16} />
            </a>
          )}
          {e.start !== null && (
            <button type="button" className="btn btn--ghost" onClick={() => downloadIcs(e)}>
              <IconCalendar width={18} height={18} /> Add to calendar
            </button>
          )}
          <button
            type="button"
            className="btn btn--text"
            onClick={() => openBooking({ date: night, occasion: e.filters.includes('Quiz') ? 'Drinks' : 'Gig night' })}
          >
            Book a table that night
          </button>
        </div>
      </div>
    </article>
  );
}
