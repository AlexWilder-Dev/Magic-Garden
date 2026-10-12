import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useClock } from '../lib/clock';
import { fmtTime } from '../lib/time';

interface Stop {
  at: number;
  time: string;
  title: string;
  text: string;
  night?: boolean;
  menu?: boolean;
}

/** A day at the Garden, from doors to last song. Positions are minutes into the trading day. */
const STOPS: Stop[] = [
  { at: 630, time: '10:30am', title: 'Doors open', text: 'Cappuccinos and the papers out in the garden.' },
  { at: 720, time: 'Lunchtime', title: 'Lunch', text: 'A reasonably priced lunch from the kitchen.', menu: true },
  { at: 840, time: 'All afternoon', title: 'Armchairs & WiFi', text: 'Vintage armchairs, free WiFi and nobody rushing you.' },
  { at: 1170, time: '7:30pm', title: 'Weeknight gigs', text: 'Free jazz, blues and world music.', night: true },
  { at: 1440, time: 'Midnight', title: 'Sunday to Thursday', text: 'Home time, Sunday to Thursday.', night: true },
  { at: 1560, time: '2am', title: 'Friday & Saturday', text: 'Festival bands and DJs till 2am.', night: true },
];

export default function DayLine() {
  const { status } = useClock();
  const t = status.open ? status.nightMin : null;
  let seg = -1;
  let frac = 0;
  if (t !== null) {
    for (let i = 0; i < STOPS.length - 1; i++) {
      if (t >= STOPS[i].at && t < STOPS[i + 1].at) {
        seg = i;
        frac = (t - STOPS[i].at) / (STOPS[i + 1].at - STOPS[i].at);
      }
    }
  }

  return (
    <div className="dayline-wrap">
      <h3 className="dayline__title">A day at the Garden</h3>
      <ol className="dayline">
        {STOPS.map((s, i) => (
          <li
            key={s.time}
            style={{ '--i': i } as CSSProperties}
            className={`dayline__stop ${i % 2 ? 'is-below' : 'is-above'} ${s.night ? 'is-night' : ''} ${t !== null && t >= s.at ? 'is-past' : ''}`}
          >
            <div className="dayline__node">
              <span className="dayline__dot" aria-hidden="true" />
              {seg === i && t !== null && (
                <span className="dayline__now" style={{ '--f': frac } as CSSProperties}>
                  <span>Now · {fmtTime(t)}</span>
                </span>
              )}
            </div>
            <div className="dayline__label">
              {seg === i && t !== null && <span className="dayline__nowchip">Now · {fmtTime(t)}</span>}
              <span className="dayline__time">{s.time}</span>
              <strong>{s.title}</strong>
              <p>
                {s.text}
                {s.menu && (
                  <>
                    {' '}
                    <Link to="/menu">See the menu</Link>.
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
