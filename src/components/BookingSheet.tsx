import { useId, useMemo, useState, type FormEvent } from 'react';
import Sheet from './Sheet';
import { AREAS, OCCASIONS, useUI, type Area, type BookingPreset, type Occasion } from '../lib/ui';
import { useClock } from '../lib/clock';
import { addDays, dowOf, fmtDay, fmtTime, type DateKey, type Status } from '../lib/time';
import { OPEN_MIN, closeMinFor } from '../data/venue';
import { IconArrow, IconCheck, IconMinus, IconPlus } from './Icons';

/** 10:30am up to an hour before closing, every half hour. */
export function slotsFor(date: DateKey, status: Status): number[] {
  const last = closeMinFor(dowOf(date)) - 60;
  const out: number[] = [];
  for (let m = OPEN_MIN; m <= last; m += 30) out.push(m);
  if (date === status.night && status.open) return out.filter((m) => m > status.nightMin);
  return out;
}

const slotLabel = (m: number) => (m >= 1440 ? `${fmtTime(m)} (late)` : fmtTime(m));

export default function BookingSheet() {
  const { booking, closeBooking } = useUI();
  return (
    <Sheet open={!!booking} onClose={closeBooking} labelledBy="booking-title" className="sheet--booking">
      {booking && <BookingForm preset={booking} />}
    </Sheet>
  );
}

function BookingForm({ preset }: { preset: BookingPreset }) {
  const { status } = useClock();
  const { closeBooking, setParty, goTo } = useUI();
  const uid = useId();

  const firstDate = slotsFor(status.night, status).length ? status.night : addDays(status.night, 1);
  const [date, setDate] = useState<DateKey>(preset.date && preset.date >= status.night ? preset.date : firstDate);
  const slots = useMemo(() => slotsFor(date, status), [date, status]);
  const [time, setTime] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState<Area>(preset.area ?? 'Inside');
  const [occasion, setOccasion] = useState<Occasion>(preset.occasion ?? 'Drinks');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const preferred = slots.find((m) => m === 19 * 60 + 30) ?? slots.find((m) => m >= 19 * 60) ?? slots[0] ?? null;
  const chosen = time !== null && slots.includes(time) ? time : preferred;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Who’s the table for?';
    if (phone.replace(/[^\d]/g, '').length < 10) errs.phone = 'A phone number, so we can reach you';
    if (chosen === null) errs.time = 'No tables left that day. Try another date.';
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`${uid}-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setDone(true);
  };

  if (done && chosen !== null) {
    return (
      <div className="booked" aria-live="polite">
        <span className="booked__tick" aria-hidden="true"><IconCheck width={28} height={28} /></span>
        <h2 id="booking-title" tabIndex={-1} className="sheet__title">
          You’re pencilled in, {name.trim().split(/\s+/)[0]}!
        </h2>
        <p className="booked__summary">
          Table for {guests}, {fmtDay(date, { long: true })} at {fmtTime(chosen)}.
          <br />
          {area} · {occasion}
        </p>
        {occasion === 'Birthday' && <p>Happy birthday to whoever it is!</p>}
        <p className="fine">Live version connects to your booking system.</p>
        <button type="button" className="btn btn--red" onClick={closeBooking}>Lovely, done</button>
      </div>
    );
  }

  return (
    <form className="booking" onSubmit={submit} noValidate>
      <p className="eyebrow">Tables · garden · groups</p>
      <h2 id="booking-title" tabIndex={-1} className="sheet__title">Book a table</h2>

      <div className="booking__row">
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            min={status.night}
            max={addDays(status.night, 180)}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Time</span>
          <select id={`${uid}-time`} value={chosen ?? ''} onChange={(e) => setTime(Number(e.target.value))} aria-invalid={!!errors.time}>
            {slots.length === 0 && <option value="">No times left</option>}
            {slots.map((m) => (
              <option key={m} value={m}>{slotLabel(m)}</option>
            ))}
          </select>
          {errors.time && <em className="field__err">{errors.time}</em>}
        </label>
      </div>

      <div className="field">
        <span id={`${uid}-guests-l`}>Guests</span>
        <div className="stepper" role="group" aria-labelledby={`${uid}-guests-l`}>
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="One fewer guest"><IconMinus /></button>
          <output aria-live="polite">{guests}</output>
          <button type="button" onClick={() => setGuests((g) => Math.min(14, g + 1))} disabled={guests >= 14} aria-label="One more guest"><IconPlus /></button>
          <button
            type="button"
            className="stepper__party"
            onClick={() => {
              setParty({ date, guests: 15 });
              closeBooking();
              window.setTimeout(() => goTo('parties-form'), 250);
            }}
          >
            15 or more? That’s a party <IconArrow width={16} height={16} />
          </button>
        </div>
      </div>

      <fieldset className="field">
        <legend>Where would you like to sit?</legend>
        <div className="pills">
          {AREAS.map((a) => (
            <label key={a} className="pill">
              <input type="radio" name="area" value={a} checked={area === a} onChange={() => setArea(a)} />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>What’s the occasion?</legend>
        <div className="pills">
          {OCCASIONS.map((o) => (
            <label key={o} className="pill">
              <input type="radio" name="occasion" value={o} checked={occasion === o} onChange={() => setOccasion(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="booking__row">
        <label className="field">
          <span>Name</span>
          <input id={`${uid}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name && <em className="field__err">{errors.name}</em>}
        </label>
        <label className="field">
          <span>Phone</span>
          <input id={`${uid}-phone`} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" aria-invalid={!!errors.phone} />
          {errors.phone && <em className="field__err">{errors.phone}</em>}
        </label>
      </div>

      <button type="submit" className="btn btn--red btn--block">
        Request this table
      </button>
      <p className="fine">Live version connects to your booking system.</p>
    </form>
  );
}
