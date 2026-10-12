import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../lib/ui';
import StatusChip from './StatusChip';

const BASE = import.meta.env.BASE_URL;

export default function Header() {
  const { goTo, openBooking } = useUI();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const section = (id: string) => () => {
    setOpen(false);
    goTo(id);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="The Magic Garden, home" onClick={() => pathname === '/' && window.scrollTo({ top: 0 })}>
          <img className="brand__logo brand__logo--day" src={`${BASE}img/logo.png`} alt="" width={459} height={205} />
          <img className="brand__logo brand__logo--night" src={`${BASE}img/logo-light.png`} alt="" width={459} height={205} />
        </Link>

        <nav className={`site-nav ${open ? 'is-open' : ''}`} id="site-nav" aria-label="Main">
          <Link to="/whats-on" className={pathname === '/whats-on' ? 'is-current' : ''}>What’s on</Link>
          <button type="button" onClick={section('garden')}>The garden</button>
          <button type="button" onClick={section('by-day')}>By day</button>
          <Link to="/menu" className={pathname === '/menu' ? 'is-current' : ''}>Menu</Link>
          <button type="button" onClick={section('parties')}>Parties</button>
          <button type="button" onClick={section('find-us')}>Find us</button>
        </nav>

        <div className="site-header__end">
          <StatusChip />
          <button type="button" className="btn btn--red btn--sm site-header__book" onClick={() => openBooking()}>
            Book a table
          </button>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close navigation' : 'Open navigation'}</span>
            <span className="nav-toggle__bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
