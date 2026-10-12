import { VENUE } from '../data/venue';
import { IconExternal } from './Icons';

export default function PlayHere() {
  return (
    <section id="play" className="play" aria-labelledby="play-title">
      <div className="wrap play__inner">
        <h2 id="play-title" className="play__title">In a band? Play here.</h2>
        <p className="play__line">
          Send your music to <a href={`mailto:${VENUE.email.music}`}>{VENUE.email.music}</a> and check our{' '}
          <a href={VENUE.backline} target="_blank" rel="noopener noreferrer">
            backline details (PDF) <IconExternal width={14} height={14} />
          </a>
          .
        </p>
      </div>
    </section>
  );
}
