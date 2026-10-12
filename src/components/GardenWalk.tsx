import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useUI } from '../lib/ui';
import Img, { type ImageName } from './Img';
import { IconChevron } from './Icons';

interface Stop {
  img: ImageName;
  title: string;
  caption: string;
  alt: string;
  position?: string;
}

const STOPS: Stop[] = [
  {
    img: 'garden-outside-bar',
    title: 'The outside bar',
    caption: 'The garden has its own bar, under fretwork arches and fairy lights. The next round is never far from your table.',
    alt: 'The garden’s outside bar: carved wooden arches, fairy lights and taps glowing green',
  },
  {
    img: 'garden-covered',
    title: 'Covered seating & the canopy',
    caption: 'Sofas, rugs and red velvet under the big canopy. When it’s nippy, out come the furry blankets and hot water bottles.',
    alt: 'Sofas and low tables under the garden canopy, framed by red velvet curtains',
  },
  {
    img: 'garden-cafe',
    title: 'The outdoor café',
    caption: 'Cappuccinos and the papers by day, with a chaise longue and vines cut into the wooden screens.',
    alt: 'The outdoor café: a gold scroll chaise longue in front of screens cut with climbing vines',
    position: '50% 60%',
  },
  {
    img: 'garden-private-seating',
    title: 'The private seating area',
    caption: 'A tucked-away corner of old brick, bamboo and fairy lights. Birthdays and groups are our speciality, so just ask when you book.',
    alt: 'A private nook with a bench, a folding chair and fairy lights against an old brick wall',
  },
  {
    img: 'garden-taxi-2',
    title: 'Our taxi',
    caption: 'Yes, there’s a black cab in the garden, painted with flowers and vines. It’s ours, and it isn’t going anywhere.',
    alt: 'A London black cab parked in the garden, painted with big purple flowers and green vines',
    position: '50% 62%',
  },
];

export default function GardenWalk() {
  const { openBooking } = useUI();
  const reduce = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const x = useMotionValue(0);
  const total = STOPS.length + 1;

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const measure = () => {
      const first = el.querySelector<HTMLElement>('.walk__stop');
      if (!first) return;
      const gap = parseFloat(getComputedStyle(first.parentElement!).columnGap || '0') || 0;
      setStep(first.offsetWidth + gap);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!step) return;
    const target = -index * step;
    if (reduce) x.set(target);
    else animate(x, target, { type: 'spring', stiffness: 260, damping: 34 });
  }, [index, step, reduce, x]);

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(total - 1, i))), [total]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <section id="garden" className="section walk" aria-labelledby="walk-title">
      <div className="wrap walk__head">
        <div>
          <p className="eyebrow">Five stops, one huge garden</p>
          <h2 id="walk-title" className="display-h2">Walk the garden</h2>
        </div>
        <p className="walk__hint">Swipe, drag or use the arrows. It’s bigger than it looks from the road.</p>
      </div>

      <div
        className="walk__viewport"
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Walk the garden"
        onKeyDown={onKey}
      >
        <motion.div
          className="walk__track"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.14}
          dragConstraints={{ left: -(total - 1) * step, right: 0 }}
          onDragEnd={(_, info) => {
            const threshold = step / 5;
            if (info.offset.x < -threshold || info.velocity.x < -480) go(index + 1);
            else if (info.offset.x > threshold || info.velocity.x > 480) go(index - 1);
            else animate(x, -index * step, { type: 'spring', stiffness: 300, damping: 34 });
          }}
        >
          {STOPS.map((s, i) => (
            <article
              key={s.title}
              className={`walk__stop ${i === index ? 'is-active' : ''}`}
              aria-roledescription="slide"
              aria-label={`Stop ${i + 1} of ${STOPS.length}: ${s.title}`}
              aria-hidden={Math.abs(i - index) > 1 ? true : undefined}
              onClick={() => i !== index && go(i)}
            >
              <div className="walk__photo">
                <Img name={s.img} alt={s.alt} position={s.position} sizes="(min-width: 1100px) 980px, 86vw" />
              </div>
              <div className="walk__caption">
                <p className="walk__num">
                  <span>{String(i + 1).padStart(2, '0')}</span> / {String(STOPS.length).padStart(2, '0')}
                </p>
                <h3>{s.title}</h3>
                <p>{s.caption}</p>
              </div>
            </article>
          ))}
          <article className={`walk__stop walk__end ${index === total - 1 ? 'is-active' : ''}`} aria-roledescription="slide" aria-label="End of the walk">
            <div className="walk__end-card">
              <p className="eyebrow">That’s the tour</p>
              <h3>Fancy a table out here?</h3>
              <p>Covered, under the canopy or open sky. Furry blankets and hot water bottles when it’s chilly.</p>
              <button
                type="button"
                className="btn btn--red"
                tabIndex={index === total - 1 ? 0 : -1}
                onClick={() => openBooking({ area: 'Garden, covered' })}
              >
                Book a garden table
              </button>
            </div>
          </article>
        </motion.div>
      </div>

      <div className="wrap walk__controls">
        <button type="button" className="round-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous stop">
          <IconChevron dir="left" />
        </button>
        <WalkProgress index={index} total={total} labels={[...STOPS.map((s) => s.title), 'Book a garden table']} go={go} />
        <button type="button" className="round-btn" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Next stop">
          <IconChevron dir="right" />
        </button>
      </div>
    </section>
  );
}

/** The vine again: it grows along as you walk, a leaf per stop. */
function WalkProgress({ index, total, labels, go }: { index: number; total: number; labels: string[]; go: (i: number) => void }) {
  const d = 'M4,22 C40,6 70,34 110,20 C150,6 180,34 220,20 C260,6 290,34 330,20 C370,6 400,34 440,20 C470,10 490,22 516,18';
  return (
    <div className="walk__progress">
      <svg viewBox="0 0 520 40" preserveAspectRatio="none" aria-hidden="true">
        <path className="walk__vine-bg" d={d} />
      </svg>
      <motion.svg
        viewBox="0 0 520 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        initial={false}
        animate={{ clipPath: `inset(0 ${(1 - index / (total - 1)) * 100}% 0 0)` }}
        transition={{ type: 'spring', stiffness: 170, damping: 26 }}
      >
        <path className="walk__vine" d={d} />
      </motion.svg>
      <ol className="walk__dots">
        {labels.map((l, i) => (
          <li key={l}>
            <button type="button" aria-label={`Go to ${l}`} aria-current={i === index ? 'step' : undefined} className={i <= index ? 'is-reached' : ''} onClick={() => go(i)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3,12 C6,4 14,2 21,5 C19,13 12,19 3,12 Z" />
              </svg>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
