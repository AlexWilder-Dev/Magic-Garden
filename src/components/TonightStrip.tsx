import { useClock } from '../lib/clock';
import { useUI } from '../lib/ui';
import { eventForNight, nextShow, showState } from '../lib/lineup';
import { fmtDay, fmtTime, relDay, tillLabel } from '../lib/time';
import { OPEN_MIN } from '../data/venue';
import { fullTitle } from '../data/events';
import { entryShort, isTicketed } from './EventSheet';
import { IconExternal } from './Icons';

/** "Tonight at the Garden": open status, then tonight's act or the next one. */
export default function TonightStrip() {
  const { status } = useClock();
  const { openEvent } = useUI();

  const tonight = eventForNight(status.night);
  const state = tonight ? showState(tonight, status) : null;
  const live = !!tonight && state !== 'done' && status.phase !== 'closed';
  const feature = live ? { key: status.night, event: tonight! } : nextShow(status, { skipTonight: status.open });

  let statusMain: string;
  let statusSub: string;
  if (!status.open) {
    statusMain = 'Closed right now';
    statusSub = `Back at ${fmtTime(OPEN_MIN)}`;
  } else if (live && state === 'on') {
    statusMain = 'On now';
    statusSub = `Open ${tillLabel(status.closeMin)}`;
  } else if (live) {
    statusMain = 'Open now';
    statusSub = tillLabel(status.closeMin);
  } else {
    statusMain = 'Garden’s open, blankets out';
    statusSub = `Open ${tillLabel(status.closeMin)}`;
  }

  const label = !feature
    ? ''
    : live
      ? state === 'on' ? 'Playing now' : `Tonight · ${fmtDay(feature.key)}`
      : status.open
        ? `Next up · ${fmtDay(feature.key)}`
        : `Next show · ${fmtDay(feature.key)}`;

  const e = feature?.event;
  const tags = e ? e.genres.filter((g) => !e.name.toLowerCase().includes(g.toLowerCase())).slice(0, 3) : [];
  const when = !e || !feature
    ? ''
    : live
      ? e.start !== null ? `${state === 'on' ? 'Started' : 'From'} ${fmtTime(e.start)} · till ${fmtTime(e.end)}` : `Till ${fmtTime(e.end)}`
      : `${cap(relDay(status.night, feature.key))}${e.start !== null ? `, ${fmtTime(e.start)}` : `, till ${fmtTime(e.end)}`}`;

  return (
    <section id="tonight" className={`tonight ${live ? 'is-live' : ''} ${status.open ? 'is-open' : 'is-closed'}`} aria-labelledby="tonight-title">
      <h2 id="tonight-title" className="sr-only">Tonight at the Garden</h2>
      <div className="tonight__status" aria-live="polite">
        <span className="tonight__dot" aria-hidden="true" />
        <span>
          <strong>{statusMain}</strong>
          <span className="tonight__sub">{statusSub}</span>
        </span>
      </div>
      {e && feature && (
        <>
          <div className="tonight__act">
            <span className="tonight__label">{label}</span>
            <button type="button" className="tonight__name" onClick={() => openEvent(feature.key, e)}>
              {fullTitle(e)}
            </button>
            {tags.length > 0 && <span className="tonight__tags">{tags.join(' · ')}</span>}
          </div>
          <div className="tonight__when">{when}</div>
          <div className="tonight__entry">
            {isTicketed(e) ? (
              <a className="btn btn--red btn--sm" href={e.url} target="_blank" rel="noopener noreferrer">
                {e.entry.kind === 'tickets' && e.entry.price ? `Tickets ${e.entry.price}` : 'Tickets'} <IconExternal width={15} height={15} />
              </a>
            ) : (
              <span className="tonight__free">{entryShort(e)}</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
