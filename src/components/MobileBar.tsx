import { Link } from 'react-router-dom';
import { useUI } from '../lib/ui';
import { VENUE } from '../data/venue';
import { IconCalendar, IconNote, IconPhone, IconPlate } from './Icons';

/** Always-there actions on phones: Tonight · Book · Menu · Call. */
export default function MobileBar() {
  const { goTo, openBooking } = useUI();
  return (
    <nav className="mobile-bar" aria-label="Quick actions">
      <button type="button" onClick={() => goTo('tonight')}>
        <IconNote />
        <span>Tonight</span>
      </button>
      <button type="button" className="mobile-bar__book" onClick={() => openBooking()}>
        <IconCalendar />
        <span>Book</span>
      </button>
      <Link to="/menu">
        <IconPlate />
        <span>Menu</span>
      </Link>
      <a href={VENUE.phoneHref}>
        <IconPhone />
        <span>Call</span>
      </a>
    </nav>
  );
}
