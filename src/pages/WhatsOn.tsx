import { useEffect, useMemo } from 'react';
import { useClock } from '../lib/clock';
import { useUI } from '../lib/ui';
import { programmeFrom } from '../lib/lineup';
import { dayNum, dayShort, fmtDay, fmtRange, monthShort } from '../lib/time';
import { fullTitle } from '../data/events';
import Img, { type ImageName } from '../components/Img';
import { FilterChips, useFilters } from '../components/Lineup';
import { WeeklyBoard } from '../components/WeeklyPattern';
import { entryText, imageFor, isTicketed } from '../components/EventSheet';
import { downloadIcs } from '../lib/ics';
import { IconCalendar, IconExternal } from '../components/Icons';

function Cal({ date, tonight }: { date: string; tonight: boolean }) {
  return (
    <p className={`cal ${tonight ? 'is-tonight' : ''}`}>
      <span className="cal__dow">{tonight ? 'Tonight' : dayShort(date)}</span>
      <span className="cal__num">{dayNum(date)}</span>
      <span className="cal__mon">{monthShort(date)}</span>
    </p>
  );
}

export default function WhatsOn() {
  const { status } = useClock();
  const { openEvent, openBooking } = useUI();
  const nights = useMemo(() => programmeFrom(status.night, 14), [status.night]);
  const { filter, setFilter, chips, matches } = useFilters(nights);

  useEffect(() => {
    document.title = 'What’s on · The Magic Garden';
  }, []);

  const shown = nights.filter((n) => (filter ? n.event && matches(n.event) : true));
  let pinned = 0;

  return (
    <div className="page whatson">
      <header className="page-head wrap">
        <p className="eyebrow">Live music most nights · {fmtDay(nights[0].key)} to {fmtDay(nights[nights.length - 1].key)}</p>
        <h1 className="display-h1">What’s on</h1>
        <p className="page-head__lede">
          Festival bands and DJs till 2am at the weekend. Free jazz, blues and world music on weeknights. Tap a poster for the details.
        </p>
      </header>

      <div className="wrap whatson__layout">
        <div className="whatson__main">
          <FilterChips chips={chips} filter={filter} setFilter={setFilter} />
          <ol className="programme">
            {shown.map((n) => {
              const tonight = n.key === status.night;
              if (!n.event) {
                return (
                  <li key={n.key} className="prog prog--quiet">
                    <Cal date={n.key} tonight={tonight} />
                    <p className="prog__quiet">No listed show. The garden’s open, blankets out.</p>
                  </li>
                );
              }
              const e = n.event;
              const img = imageFor(e);
              pinned += 1;
              return (
                <li key={n.key} className={`prog prog--${e.tier} ${pinned % 2 ? 'is-odd' : 'is-even'}`}>
                  <Cal date={n.key} tonight={tonight} />
                  <button
                    type="button"
                    className={`prog__art ${img.poster ? 'is-poster' : 'is-room'}`}
                    onClick={() => openEvent(n.key, e)}
                    aria-label={`More about ${fullTitle(e)}`}
                  >
                    <span className="prog__tape" aria-hidden="true" />
                    <Img name={img.name as ImageName} alt="" sizes="(min-width: 960px) 320px, 80vw" />
                    {!img.poster && <span className="prog__tba">Act to be announced</span>}
                  </button>
                  <div className="prog__body">
                    {e.presenter && e.presenter !== e.name && <p className="prog__presenter">{e.presenter}</p>}
                    <h2 className={`prog__name ${e.tba ? 'is-tba' : ''}`}>
                      <button type="button" onClick={() => openEvent(n.key, e)}>{e.name}</button>
                      {e.origin && <span className="prog__origin"> ({e.origin})</span>}
                    </h2>
                    {e.support && <p className="prog__support">{e.support}</p>}
                    <ul className="tags">
                      {e.genres.map((g) => <li key={g}>{g}</li>)}
                    </ul>
                    <p className="prog__blurb">{e.blurb[0]} {e.blurb[1]}</p>
                    <p className="prog__meta">
                      <strong>{fmtRange(e.start, e.end)}</strong> · {entryText(e)}
                    </p>
                    <div className="prog__actions">
                      {isTicketed(e) && (
                        <a className="btn btn--red btn--sm" href={e.url} target="_blank" rel="noopener noreferrer">
                          Tickets <IconExternal width={14} height={14} />
                        </a>
                      )}
                      {!isTicketed(e) && e.url && (
                        <a className="btn btn--ghost btn--sm" href={e.url} target="_blank" rel="noopener noreferrer">
                          Eventbrite <IconExternal width={14} height={14} />
                        </a>
                      )}
                      {e.start !== null && (
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => downloadIcs(e)}>
                          <IconCalendar width={16} height={16} /> Add to calendar
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn--text btn--sm"
                        onClick={() => openBooking({ date: n.key, occasion: e.filters.includes('Quiz') ? 'Drinks' : 'Gig night' })}
                      >
                        Book a table
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
            {shown.length === 0 && <li className="prog prog--quiet"><p className="prog__quiet">Nothing in that genre right now. Try “Everything”.</p></li>}
          </ol>
        </div>
        <aside className="whatson__aside" aria-label="Weekly regulars">
          <WeeklyBoard />
        </aside>
      </div>
    </div>
  );
}
