import { Link } from 'react-router-dom';
import { VENUE } from '../data/venue';
import { IconFacebook, IconInstagram, IconX } from './Icons';

const BASE = import.meta.env.BASE_URL;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img className="brand__logo--night" src={`${BASE}img/logo-light.png`} alt="The Magic Garden" width={459} height={205} loading="lazy" />
          <p className="site-footer__tag">A festival in a pub, {VENUE.near}.</p>
        </div>
        <div className="site-footer__cols">
          <div>
            <h2 className="eyebrow">Find us</h2>
            <p>
              {VENUE.street}
              <br />
              {VENUE.city}
            </p>
            <p>
              <a href={VENUE.phoneHref}>{VENUE.phone}</a>
            </p>
          </div>
          <div>
            <h2 className="eyebrow">Write to us</h2>
            <ul className="plain">
              <li>General <a href={`mailto:${VENUE.email.info}`}>{VENUE.email.info}</a></li>
              <li>Bookings <a href={`mailto:${VENUE.email.bookings}`}>{VENUE.email.bookings}</a></li>
              <li>Bands <a href={`mailto:${VENUE.email.music}`}>{VENUE.email.music}</a></li>
              <li>Press <a href={`mailto:${VENUE.email.press}`}>{VENUE.email.press}</a></li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Around the site</h2>
            <ul className="plain">
              <li><Link to="/whats-on">What’s on</Link></li>
              <li><Link to="/menu">Food menu</Link></li>
              <li><a href={VENUE.backline} target="_blank" rel="noopener noreferrer">Backline details (PDF)</a></li>
            </ul>
            <div className="socials">
              <a href={VENUE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram /></a>
              <a href={VENUE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook /></a>
              <a href={VENUE.social.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><IconX /></a>
            </div>
          </div>
        </div>
      </div>
      <p className="site-footer__credit">Site by AlexWilder-Dev</p>
    </footer>
  );
}
