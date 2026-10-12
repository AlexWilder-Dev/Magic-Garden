import { Link } from 'react-router-dom';
import { useUI } from '../lib/ui';
import Img from './Img';
import DayLine from './DayLine';
import { IconArrow } from './Icons';

/** Always set in daylight colours, whatever the time: this is the café half of the pub. */
export default function ByDay() {
  const { openBooking } = useUI();
  return (
    <section id="by-day" className="section byday" data-phase="day" aria-labelledby="byday-title">
      <div className="wrap">
        <div className="byday__top">
          <header className="byday__head">
            <p className="eyebrow">Open from 10:30am, every day</p>
            <h2 id="byday-title" className="display-h2">
              By day, it’s a <em>garden café</em>
            </h2>
            <p className="byday__lede">
              Weekdays here are slow and cosy: cappuccinos and newspapers in the garden, a reasonably priced lunch, vintage armchairs and free WiFi.
            </p>
            <div className="byday__actions">
              <button type="button" className="btn btn--red" onClick={() => openBooking({ occasion: 'Lunch' })}>
                Book lunch
              </button>
              <Link to="/menu" className="btn btn--text">
                See the menu <IconArrow width={18} height={18} />
              </Link>
            </div>
          </header>

          <div className="byday__photos">
            <figure className="byday__armchairs">
              <Img name="inside-seating" alt="Two buttoned velvet armchairs by a dartboard, with a vintage radio on the shelf" sizes="(min-width: 960px) 520px, 90vw" />
            </figure>
            <figure className="byday__radio">
              <Img name="contact-1" alt="Close-up of the pub’s old Philco valve radio" sizes="(min-width: 960px) 260px, 50vw" />
            </figure>
          </div>
        </div>

        <figure className="byday__pano">
          <Img name="garden-outside-view" alt="The garden by day: patterned sofas, wicker chairs and plants under the canopy, the pub’s big windows behind" sizes="(min-width: 1240px) 1200px, 100vw" />
          <figcaption>Under the canopy by day: sofas, wicker and a lot of cushions.</figcaption>
        </figure>

        <DayLine />
      </div>
    </section>
  );
}
