import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClock } from '../lib/clock';
import { useUI } from '../lib/ui';
import { nightsFrom, type Night } from '../lib/lineup';
import { dayNum, dayShort, fmtDay, fmtRange, fmtTime, monthShort, partsOf } from '../lib/time';
import { FILTER_ORDER, fullTitle, type Filter, type GigEvent } from '../data/events';
import FitLine from './FitLine';
import { entryText } from './EventSheet';
import { IconArrow, IconList, IconPoster } from './Icons';
import WeeklyPattern from './WeeklyPattern';

const BASE = import.meta.env.BASE_URL;
const VIEW_KEY = 'mg-lineup-view';

function readView(): 'poster' | 'list' {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'poster';
  } catch {
    return 'poster';
  }
}

export function useFilters(nights: Night[]) {
  const [filter, setFilter] = useState<Filter | null>(null);
  const chips = useMemo(() => FILTER_ORDER.filter((f) => nights.some((n) => n.event?.filters.includes(f))), [nights]);
  const matches = (e: GigEvent | null) => !filter || !!e?.filters.includes(filter);
  return { filter, setFilter, chips, matches };
}

export function FilterChips({ chips, filter, setFilter, label = 'Filter by genre' }: { chips: Filter[]; filter: Filter | null; setFilter: (f: Filter | null) => void; label?: string }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      <button type="button" className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>Everything</button>
      {chips.map((c) => (
        <button key={c} type="button" className="chip" aria-pressed={filter === c} onClick={() => setFilter(filter === c ? null : c)}>
          {c}
        </button>
      ))}
    </div>
  );
}

const rangeLabel = (a: string, b: string) => {
  const pa = partsOf(a);
  const pb = partsOf(b);
  return pa.m === pb.m ? `${dayShort(a)} ${pa.d} – ${dayShort(b)} ${pb.d} ${monthShort(b)}` : `${fmtDay(a)} – ${fmtDay(b)}`;
};

const dayTag = (key: string) => `${dayShort(key)} ${dayNum(key)}`;

export default function Lineup() {
  const { status } = useClock();
  const nights = useMemo(() => nightsFrom(status.night, 14), [status.night]);
  const { filter, setFilter, chips, matches } = useFilters(nights);
  const [view, setViewState] = useState<'poster' | 'list'>(readView);

  const setView = (v: 'poster' | 'list') => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* private mode */
    }
  };

  return (
    <section id="lineup" className="section lineup" aria-labelledby="lineup-title">
      <div className="wrap">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">The next 14 nights</p>
            <h2 id="lineup-title" className="display-h2">The Line-up</h2>
            <p className="section-head__lede">
              Big festival bands and DJs at the weekend, free jazz, blues and world music on weeknights. Tap any act for times, tickets and the calendar.
            </p>
          </div>
          <div className="view-toggle" role="group" aria-label="Line-up view">
            <button type="button" aria-pressed={view === 'poster'} onClick={() => setView('poster')}>
              <IconPoster width={18} height={18} /> Poster
            </button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <IconList width={18} height={18} /> Plain list
            </button>
          </div>
        </header>

        <FilterChips chips={chips} filter={filter} setFilter={setFilter} />

        {view === 'poster' ? (
          <Poster nights={nights} matches={matches} filtered={!!filter} />
        ) : (
          <LineupList nights={nights} matches={matches} filtered={!!filter} />
        )}

        <div className="lineup__more">
          <Link to="/whats-on" className="btn btn--text">
            Full programme with posters <IconArrow width={18} height={18} />
          </Link>
        </div>

        <WeeklyPattern />
      </div>
    </section>
  );
}

function Poster({ nights, matches, filtered }: { nights: Night[]; matches: (e: GigEvent | null) => boolean; filtered: boolean }) {
  const { status } = useClock();
  const { openEvent } = useUI();
  const halves = [nights.slice(0, 7), nights.slice(7, 14)];
  const first = nights[0].key;
  const last = nights[nights.length - 1].key;

  const open = (n: Night) => n.event && openEvent(n.key, n.event);
  const aria = (n: Night) => {
    const e = n.event!;
    return `${fmtDay(n.key, { long: true })}: ${fullTitle(e)}${e.tba ? ', act to be announced' : ''}. ${fmtRange(e.start, e.end)}. ${entryText(e)}.`;
  };
  const tonightBadge = (n: Night) => (n.key === status.night ? <span className="badge">Tonight</span> : null);

  return (
    <div className={`poster ${filtered ? 'is-filtered' : ''}`}>
      <div className="poster__frame">
        <header className="poster__head">
          <img src={`${BASE}img/logo-light.png`} alt="The Magic Garden" width={459} height={205} className="poster__logo" loading="lazy" />
          <p className="poster__presents">A festival in a pub</p>
          <p className="poster__dates">{rangeLabel(first, last)} {partsOf(last).y}</p>
        </header>

        {halves.map((half, hi) => {
          const heads = half.filter((n) => n.event?.tier === 'headline');
          const mids = half.filter((n) => n.event?.tier === 'mid');
          const smalls = half.filter((n) => n.event?.tier === 'small');
          const quiet = half.filter((n) => !n.event);
          return (
            <div className="poster__week" key={hi}>
              <p className="poster__range">
                <span>{rangeLabel(half[0].key, half[half.length - 1].key)}</span>
              </p>
              <ul className="bills bills--head">
                {heads.map((n) => (
                  <li key={n.key} className={`bill bill--head ${matches(n.event) ? '' : 'is-dim'} ${n.event!.tba ? 'is-tba' : ''}`}>
                    <button type="button" onClick={() => open(n)} aria-label={aria(n)}>
                      <span className="bill__when">
                        {tonightBadge(n)}
                        {dayTag(n.key)}
                        {n.event!.start !== null ? ` · ${fmtTime(n.event!.start)}` : ' · till 2am'}
                      </span>
                      {n.event!.presenter && n.event!.presenter !== n.event!.name && <span className="bill__presenter">{n.event!.presenter}</span>}
                      <span className="bill__name">
                        <FitLine ratio={0.14} cap={112} min={26}>{n.event!.name}</FitLine>
                      </span>
                      {n.event!.support && <span className="bill__support">{n.event!.support}</span>}
                      {n.event!.tba && <span className="bill__support">Line-up to be announced</span>}
                    </button>
                  </li>
                ))}
              </ul>
              {mids.length > 0 && (
                <ul className="bills bills--mid">
                  {mids.map((n) => (
                    <li key={n.key} className={`bill bill--mid ${matches(n.event) ? '' : 'is-dim'}`}>
                      <button type="button" onClick={() => open(n)} aria-label={aria(n)}>
                        <span className="bill__when">{tonightBadge(n)}{dayTag(n.key)}</span>
                        <span className="bill__name">
                          {n.event!.name}
                          {n.event!.support && <small> {n.event!.support.replace('featuring', 'ft.')}</small>}
                          {n.event!.tba && <small> act tba</small>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {smalls.length > 0 && (
                <ul className="bills bills--small">
                  {smalls.map((n) => (
                    <li key={n.key} className={`bill bill--small ${matches(n.event) ? '' : 'is-dim'}`}>
                      <button type="button" onClick={() => open(n)} aria-label={aria(n)}>
                        {tonightBadge(n)}
                        {dayTag(n.key)} · {n.event!.name} · free, £2 to play
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {quiet.length > 0 && (
                <p className={`poster__quiet ${filtered ? 'is-dim' : ''}`}>
                  {quiet.map((n) => dayTag(n.key)).join(' & ')}: no show, garden open
                </p>
              )}
            </div>
          );
        })}

        <footer className="poster__foot">
          <span>Weeknights free entry</span>
          <span>Fri &amp; Sat till 2am</span>
          <span>231 Battersea Park Road SW11</span>
        </footer>
      </div>
    </div>
  );
}

function LineupList({ nights, matches, filtered }: { nights: Night[]; matches: (e: GigEvent | null) => boolean; filtered: boolean }) {
  const { status } = useClock();
  const { openEvent } = useUI();
  const shown = nights.filter((n) => (filtered ? n.event && matches(n.event) : true));
  return (
    <ol className="lineup-list">
      {shown.map((n) =>
        n.event ? (
          <li key={n.key} className={`ll ll--${n.event.tier}`}>
            <p className="ll__date">
              <span>{dayShort(n.key)}</span>
              <strong>{dayNum(n.key)}</strong>
              <span>{monthShort(n.key)}</span>
            </p>
            <div className="ll__main">
              {n.key === status.night && <span className="badge">Tonight</span>}
              <h3 className="ll__name">
                <button type="button" onClick={() => openEvent(n.key, n.event!)}>
                  {fullTitle(n.event)}
                  {n.event.tba && <span className="ll__tba"> (act to be announced)</span>}
                </button>
              </h3>
              <p className="ll__genres">{n.event.genres.join(' · ')}</p>
            </div>
            <p className="ll__meta">
              <span>{fmtRange(n.event.start, n.event.end)}</span>
              <span>{entryText(n.event)}</span>
            </p>
          </li>
        ) : (
          <li key={n.key} className="ll ll--quiet">
            <p className="ll__date">
              <span>{dayShort(n.key)}</span>
              <strong>{dayNum(n.key)}</strong>
              <span>{monthShort(n.key)}</span>
            </p>
            <p className="ll__main">No listed show. The garden’s open.</p>
          </li>
        ),
      )}
      {shown.length === 0 && <li className="ll ll--quiet">Nothing in that genre this fortnight.</li>}
    </ol>
  );
}
