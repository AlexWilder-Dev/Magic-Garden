import { REVIEWS, VENUE } from '../data/venue';

function Stars({ value }: { value: number }) {
  const pct = `${(value / 5) * 100}%`;
  const star = 'M12 2.6l2.8 6.1 6.6.7-4.9 4.5 1.4 6.5L12 17.1l-5.9 3.3 1.4-6.5-4.9-4.5 6.6-.7z';
  const row = (
    <svg viewBox="0 0 120 24" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={star} transform={`translate(${i * 24} 0)`} />
      ))}
    </svg>
  );
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      <span className="stars__empty">{row}</span>
      <span className="stars__full" style={{ width: pct }}>{row}</span>
    </span>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="section reviews" aria-labelledby="reviews-title">
      <div className="wrap reviews__inner">
        <div className="reviews__score">
          <h2 id="reviews-title" className="sr-only">Reviews</h2>
          <p className="reviews__num">{VENUE.rating.toFixed(1)}</p>
          <Stars value={VENUE.rating} />
          <p className="reviews__count">
            from {VENUE.reviewCount.toLocaleString('en-GB')} Google reviews
          </p>
          <a className="btn btn--text" href={VENUE.directions} target="_blank" rel="noopener noreferrer">Read them on Google</a>
        </div>
        <figure className="reviews__lead">
          <blockquote>
            <p>“{REVIEWS.festival}”</p>
          </blockquote>
          <figcaption>Google review</figcaption>
        </figure>
        <figure className="reviews__second">
          <blockquote>
            <p>“{REVIEWS.design}”</p>
          </blockquote>
          <figcaption>Google review</figcaption>
        </figure>
      </div>
    </section>
  );
}
