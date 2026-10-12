import { useClock } from '../lib/clock';
import { useUI } from '../lib/ui';
import { eventForNight, nextShow, showState } from '../lib/lineup';
import { fmtDay, fmtTime, relDay, tillLabel } from '../lib/time';
import { OPEN_MIN } from '../data/venue';
import type { GigEvent } from '../data/events';
import ArchFrame from './ArchFrame';
import FitLine from './FitLine';
import Img, { type ImageName } from './Img';
import TonightStrip from './TonightStrip';
import { isTicketed } from './EventSheet';
import { IconArrow, IconExternal } from './Icons';

/** Splits an act name into poster lines of roughly even length. */
export function posterLines(name: string): string[] {
  if (name.length <= 13) return [name];
  const words = name.split(' ');
  let best = [name];
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const score = Math.abs(a.length - b.length);
    if (score < bestScore) {
      best = [a, b];
      bestScore = score;
    }
  }
  return best;
}

type Mode = 'day' | 'act' | 'garden' | 'closed';

export default function Hero() {
  const { status, now } = useClock();
  const { openBooking, openEvent, goTo } = useUI();

  const tonight = eventForNight(status.night);
  const state = tonight ? showState(tonight, status) : null;
  const mode: Mode = !status.open
    ? 'closed'
    : status.phase === 'day'
      ? 'day'
      : tonight && state !== 'done'
        ? 'act'
        : 'garden';
  const next = nextShow(status, { skipTonight: status.open && mode !== 'day' });

  let kicker = '';
  let lines: string[] = [];
  let lede = '';
  let photo: { name: ImageName; alt: string; position?: string };
  let actions: JSX.Element;
  let pinned: JSX.Element | null = null;
  let sub: string | null = null;

  const nextLine = (n: { key: string; event: GigEvent } | null) =>
    n ? `${n.event.name}, ${relDay(status.night, n.key)}${n.event.start !== null ? ` at ${fmtTime(n.event.start)}` : ''}` : '';

  switch (mode) {
    case 'day':
      kicker = `Today at the Garden · ${fmtDay(now.key)}`;
      lines = ['Coffee’s on', 'in the garden'];
      lede = 'Cappuccinos and the papers under the canopy, a reasonably priced lunch, vintage armchairs and free WiFi. Open from 10:30am, every day.';
      photo = { name: 'garden-canopy', alt: 'Sofas, gilded chairs and fairy lights under the garden canopy by day', position: '58% 50%' };
      pinned = (
        <p className="hero__note">
          <span>Free WiFi</span>
          <span>Vintage armchairs</span>
          <span>The papers</span>
        </p>
      );
      actions = (
        <>
          <button type="button" className="btn btn--red" onClick={() => openBooking({ occasion: 'Lunch' })}>Book a table</button>
          {tonight ? (
            <button type="button" className="btn btn--text" onClick={() => openEvent(status.night, tonight)}>
              Later tonight: {tonight.name} <IconArrow width={18} height={18} />
            </button>
          ) : (
            <button type="button" className="btn btn--text" onClick={() => goTo('lineup')}>
              What’s on this fortnight <IconArrow width={18} height={18} />
            </button>
          )}
        </>
      );
      break;

    case 'act': {
      const e = tonight!;
      kicker = `${state === 'on' ? 'On now' : 'Tonight'} at the Garden · ${fmtDay(status.night)}`;
      lines = posterLines(e.name);
      sub = e.support ?? null;
      lede = `${e.blurb[0]} ${e.blurb[1]}`;
      photo = { name: 'home-3', alt: 'A band in full swing on the Magic Garden stage', position: '50% 40%' };
      pinned = e.image ? (
        <figure className="hero__poster">
          <Img name={e.image as ImageName} alt={`Poster for ${e.name}`} sizes="240px" eager />
        </figure>
      ) : null;
      actions = (
        <>
          {isTicketed(e) ? (
            <a className="btn btn--red" href={e.url} target="_blank" rel="noopener noreferrer">
              Get tickets {e.entry.kind === 'tickets' && e.entry.price} <IconExternal width={16} height={16} />
            </a>
          ) : (
            <button type="button" className="btn btn--red" onClick={() => openBooking({ date: status.night, occasion: 'Gig night' })}>
              Book a table for tonight
            </button>
          )}
          <button type="button" className="btn btn--text" onClick={() => openEvent(status.night, e)}>
            {e.entry.kind === 'free' || e.entry.kind === 'quiz' ? 'Free entry · more about tonight' : 'More about tonight'} <IconArrow width={18} height={18} />
          </button>
        </>
      );
      break;
    }

    case 'garden':
      kicker = `Tonight at the Garden · ${fmtDay(status.night)}`;
      lines = ['The garden’s', 'yours tonight'];
      lede = tonight
        ? `That’s the music done for tonight, but we’re open ${tillLabel(status.closeMin)}. Covered seating, the canopy, and furry blankets and hot water bottles when it’s chilly.`
        : `No show tonight, so it’s all about the garden: covered seating, the canopy, and furry blankets and hot water bottles when it’s chilly. Open ${tillLabel(status.closeMin)}.`;
      photo = { name: 'garden-main', alt: 'The garden at dusk: picnic tables, lanterns, fairy lights and the painted taxi', position: '55% 50%' };
      actions = (
        <>
          <button type="button" className="btn btn--red" onClick={() => openBooking({ date: status.night, area: 'Garden, covered' })}>
            Book a garden table
          </button>
          {next && (
            <button type="button" className="btn btn--text" onClick={() => openEvent(next.key, next.event)}>
              Next up: {nextLine(next)} <IconArrow width={18} height={18} />
            </button>
          )}
        </>
      );
      break;

    default:
      kicker = 'The Magic Garden · Battersea';
      lines = ['Lights out.', `Back at ${fmtTime(OPEN_MIN)}`];
      lede = `Coffee in the garden from ${fmtTime(OPEN_MIN)}.${next ? ` Next show: ${nextLine(next)}.` : ''}`;
      photo = { name: 'garden-taxi-1', alt: 'Fairy lights strung inside the garden’s painted taxi at night', position: '40% 50%' };
      actions = (
        <>
          <button type="button" className="btn btn--red" onClick={() => goTo('lineup')}>See the line-up</button>
          <button type="button" className="btn btn--text" onClick={() => openBooking()}>
            Book a table <IconArrow width={18} height={18} />
          </button>
        </>
      );
  }

  return (
    <section className={`hero hero--${mode}`} aria-labelledby="hero-title">
      <div className="hero__grid wrap">
        <div className="hero__top">
          <p className="hero__kicker">
            <span className="hero__kicker-dot" aria-hidden="true" />
            {kicker}
          </p>
          {mode === 'act' && tonight?.presenter && tonight.presenter !== tonight.name && (
            <p className="hero__presenter">{tonight.presenter}</p>
          )}
          <h1 id="hero-title" className={`hero__title ${mode === 'act' ? 'is-act' : ''}`}>
            {lines.map((l, i) => (
              <span className="hero__line" key={l + i}>
                <FitLine ratio={0.2} cap={mode === 'act' ? 150 : 120} min={30}>{l}</FitLine>{' '}
              </span>
            ))}
          </h1>
          {sub && <p className="hero__support">{sub}</p>}
        </div>
        <div className="hero__art">
          <ArchFrame>
            <Img name={photo.name} alt={photo.alt} position={photo.position} eager sizes="(min-width: 960px) 44vw, 100vw" />
          </ArchFrame>
          {pinned}
        </div>
        <div className="hero__bottom">
          <p className="hero__lede">{lede}</p>
          <div className="hero__actions">{actions}</div>
          <p className="hero__tagline">A festival in a pub, by Battersea Park.</p>
        </div>
        <TonightStrip />
      </div>
    </section>
  );
}
