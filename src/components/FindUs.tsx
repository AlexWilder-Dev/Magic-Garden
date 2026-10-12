import { useState, type FormEvent } from 'react';
import { HOURS_ROWS, OPEN_MIN, VENUE } from '../data/venue';
import { useClock } from '../lib/clock';
import { useUI } from '../lib/ui';
import { eventForNight, nextShow, showState } from '../lib/lineup';
import { dowOf, fmtDay, fmtTime, relDay, tillLabel } from '../lib/time';
import { fullTitle } from '../data/events';
import FitLine from './FitLine';
import { IconCheck, IconPhone, IconPin } from './Icons';

function QuickAnswers() {
  const { status } = useClock();
  const { openEvent } = useUI();
  const tonight = eventForNight(status.night);
  const live = tonight && showState(tonight, status) !== 'done' && status.open;
  const next = nextShow(status, { skipTonight: status.open });

  return (
    <dl className="answers">
      <div>
        <dt>Are you open?</dt>
        <dd>
          {status.open
            ? `Yes, open now ${tillLabel(status.closeMin)}.`
            : `Not right now. We open at ${fmtTime(OPEN_MIN)}, every day.`}
        </dd>
      </div>
      <div>
        <dt>What’s on?</dt>
        <dd>
          {live && tonight ? (
            <button type="button" className="link" onClick={() => openEvent(status.night, tonight)}>
              Tonight: {fullTitle(tonight)}{tonight.start !== null ? `, ${fmtTime(tonight.start)}` : ''}
            </button>
          ) : next ? (
            <button type="button" className="link" onClick={() => openEvent(next.key, next.event)}>
              {relDay(status.night, next.key) === 'tonight' ? 'Tonight' : `Next up, ${relDay(status.night, next.key)}`}: {fullTitle(next.event)}
            </button>
          ) : (
            'See the line-up above.'
          )}
        </dd>
      </div>
      <div>
        <dt>Is the garden warm?</dt>
        <dd>There’s covered seating and a canopy, and furry blankets and hot water bottles when it’s chilly.</dd>
      </div>
      <div>
        <dt>Where are you?</dt>
        <dd>
          {VENUE.street}, {VENUE.city}, {VENUE.near}.
        </dd>
      </div>
    </dl>
  );
}

/** Sign-up styled as a gig guest list. Front end only. */
function GuestList() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('That email doesn’t look quite right');
      return;
    }
    setError('');
    setDone(true);
  };
  return (
    <div className="guestlist">
      <span className="guestlist__clip" aria-hidden="true" />
      <p className="guestlist__venue">The Magic Garden</p>
      <h3 className="guestlist__title">The guest list</h3>
      <p className="guestlist__sub">Hear about new acts and big weekend nights first, by email.</p>
      {done ? (
        <div aria-live="polite">
          <p className="guestlist__line is-filled">
            <span className="guestlist__n">1.</span>
            <span className="guestlist__name">{email}</span>
            <span className="guestlist__tick" aria-hidden="true"><IconCheck width={20} height={20} /></span>
          </p>
          <p className="guestlist__done">You’re on the list.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="guestlist__line">
            <span className="guestlist__n">1.</span>
            <label className="sr-only" htmlFor="guest-email">Email address</label>
            <input
              id="guest-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={!!error}
              aria-describedby={error ? 'guest-err' : undefined}
            />
          </p>
          {error && <em id="guest-err" className="field__err">{error}</em>}
          <button type="submit" className="btn btn--red">Put me on the list</button>
        </form>
      )}
      <p className="guestlist__line is-blank" aria-hidden="true"><span className="guestlist__n">2.</span></p>
      <p className="guestlist__line is-blank" aria-hidden="true"><span className="guestlist__n">3.</span></p>
    </div>
  );
}

export default function FindUs() {
  const { status } = useClock();
  const today = dowOf(status.night);
  return (
    <section id="find-us" className="section findus" aria-labelledby="findus-title">
      <div className="wrap">
        <header className="findus__head">
          <p className="eyebrow">Find us {VENUE.near}</p>
          <h2 id="findus-title" className="findus__address">
            <span className="sr-only">Find us: </span>
            <span className="findus__street findus__street--one">
              <FitLine ratio={0.12} cap={150} min={34}>231 Battersea Park Road</FitLine>
            </span>
            <span className="findus__street findus__street--two" aria-hidden="true">
              <FitLine ratio={0.2} cap={120} min={34}>231 Battersea</FitLine>
              <FitLine ratio={0.2} cap={120} min={34}>Park Road</FitLine>
            </span>
            <span className="findus__city">London SW11 4LG</span>
          </h2>
          <div className="findus__actions">
            <a className="btn btn--red" href={VENUE.directions} target="_blank" rel="noopener noreferrer">
              <IconPin width={18} height={18} /> Directions
            </a>
            <a className="btn btn--ghost" href={VENUE.phoneHref}>
              <IconPhone width={18} height={18} /> {VENUE.phone}
            </a>
          </div>
        </header>

        <div className="findus__grid">
          <div className="findus__hours">
            <table className="hours">
              <caption className="eyebrow">Opening hours</caption>
              <tbody>
                {HOURS_ROWS.map((r) => (
                  <tr key={r.days} className={r.dows.includes(today) ? 'is-today' : ''}>
                    <th scope="row">
                      <abbr title={r.days}>{r.short}</abbr>
                    </th>
                    <td>{r.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="findus__today">
              {status.open ? `Open now, ${tillLabel(status.closeMin)}.` : `Closed now. Back at ${fmtTime(OPEN_MIN)}.`} It’s {fmtDay(status.night, { long: true })}.
            </p>
            <ul className="plain findus__emails">
              <li><span>Bookings</span> <a href={`mailto:${VENUE.email.bookings}`}>{VENUE.email.bookings}</a></li>
              <li><span>General</span> <a href={`mailto:${VENUE.email.info}`}>{VENUE.email.info}</a></li>
              <li><span>Press</span> <a href={`mailto:${VENUE.email.press}`}>{VENUE.email.press}</a></li>
            </ul>
          </div>

          <div className="board findus__board">
            <h3 className="board__title">Quick answers</h3>
            <QuickAnswers />
          </div>

          <GuestList />
        </div>
      </div>
    </section>
  );
}
