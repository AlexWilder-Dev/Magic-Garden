import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { PARTY_MENUS } from '../data/menu';
import { REVIEWS, VENUE } from '../data/venue';
import { useUI } from '../lib/ui';
import { useClock } from '../lib/clock';
import { addDays, fmtDay } from '../lib/time';
import Img from './Img';
import { IconCheck } from './Icons';

export function SetLists({ onPick }: { onPick?: (id: string) => void }) {
  return (
    <div className="setlists">
      {PARTY_MENUS.map((m, i) => {
        let n = 0;
        return (
          <article key={m.id} className={`setlist setlist--${i + 1}`} aria-labelledby={`set-${m.id}`}>
            <span className="setlist__tape" aria-hidden="true" />
            <header className="setlist__head">
              <p className="setlist__set">{m.set}</p>
              <h3 id={`set-${m.id}`}>{m.name}</h3>
              <p className="setlist__price">
                {m.price} <span>per person</span>
              </p>
            </header>
            {m.groups.map((g) => (
              <div key={g.label ?? 'items'} className="setlist__group">
                {g.label && <p className="setlist__label">{g.label}</p>}
                <ol>
                  {g.items.map((item) => {
                    n += 1;
                    return (
                      <li key={item} value={n}>
                        {item}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
            {onPick && (
              <button type="button" className="setlist__pick" onClick={() => onPick(m.id)}>
                Enquire about {m.set.toLowerCase()}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default function Parties() {
  const { party, setParty } = useUI();
  const { status } = useClock();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: '', email: '', date: '', guests: '15', menu: 'unsure', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!party) return;
    setForm((f) => ({
      ...f,
      date: party.date ?? f.date,
      guests: party.guests ? String(party.guests) : f.guests,
      menu: party.menu ?? f.menu,
    }));
    setSent(false);
    setParty(null);
  }, [party, setParty]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pick = (id: string) => {
    setForm((f) => ({ ...f, menu: id }));
    setSent(false);
    document.getElementById('parties-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById(`${uid}-name`)?.focus({ preventScroll: true }), 500);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Your name, please';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'An email we can reply to';
    if (!form.date) errs.date = 'Roughly when?';
    if (!(Number(form.guests) >= 15)) errs.guests = 'Party menus start at 15 people';
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  const menuName = PARTY_MENUS.find((m) => m.id === form.menu);

  return (
    <section id="parties" className="section parties" aria-labelledby="parties-title">
      <div className="wrap">
        <header className="section-head parties__head">
          <p className="eyebrow">Birthdays, groups &amp; work dos</p>
          <h2 id="parties-title" className="display-h2">
            Parties are our <em>speciality</em>
          </h2>
          <p className="section-head__lede">
            Three set menus for groups of 15 or more, priced per person. Pick a set, tell us the date, and we’ll take it from there.
          </p>
        </header>

        <SetLists onPick={pick} />

        <div className="parties__lower">
          <figure className="parties__quote">
            <div className="parties__quote-photo">
              <Img name="inside-restaurant-3" alt="The long restaurant room with fairy lights along the ceiling and big painted portraits" sizes="(min-width: 960px) 520px, 100vw" />
            </div>
            <blockquote>
              <p>“{REVIEWS.corporate}”</p>
            </blockquote>
            <figcaption>Google review</figcaption>
          </figure>

          <div id="parties-form" className="enquiry" tabIndex={-1}>
            {sent ? (
              <div className="enquiry__done" aria-live="polite">
                <span className="booked__tick" aria-hidden="true"><IconCheck width={28} height={28} /></span>
                <h3>Thanks, {form.name.trim().split(/\s+/)[0]}! Your party’s on our radar.</h3>
                <p>
                  {form.guests} people{form.date ? `, ${fmtDay(form.date, { long: true })}` : ''}
                  {menuName ? `, ${menuName.name} (${menuName.price} pp)` : ''}.
                </p>
                <p className="fine">Live version sends this to {VENUE.email.bookings}.</p>
                <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} noValidate>
                <h3 className="enquiry__title">Plan a party</h3>
                <div className="booking__row">
                  <label className="field">
                    <span>Name</span>
                    <input id={`${uid}-name`} value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                    {errors.name && <em className="field__err">{errors.name}</em>}
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input id={`${uid}-email`} type="email" value={form.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
                    {errors.email && <em className="field__err">{errors.email}</em>}
                  </label>
                </div>
                <div className="booking__row">
                  <label className="field">
                    <span>Date</span>
                    <input id={`${uid}-date`} type="date" value={form.date} min={status.night} max={addDays(status.night, 365)} onChange={set('date')} aria-invalid={!!errors.date} />
                    {errors.date && <em className="field__err">{errors.date}</em>}
                  </label>
                  <label className="field">
                    <span>Guests</span>
                    <input id={`${uid}-guests`} type="number" inputMode="numeric" min={15} value={form.guests} onChange={set('guests')} aria-invalid={!!errors.guests} />
                    {errors.guests && <em className="field__err">{errors.guests}</em>}
                  </label>
                </div>
                <label className="field">
                  <span>Menu</span>
                  <select value={form.menu} onChange={set('menu')}>
                    {PARTY_MENUS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}, {m.price} per person
                      </option>
                    ))}
                    <option value="unsure">Not sure yet</option>
                  </select>
                </label>
                <label className="field">
                  <span>Anything else?</span>
                  <textarea rows={3} value={form.message} onChange={set('message')} placeholder="Birthday, leaving do, team night out…" />
                </label>
                <button type="submit" className="btn btn--red btn--block">Send enquiry</button>
                <p className="fine">Minimum 15 people for party menus. Smaller group? Book a table instead.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
