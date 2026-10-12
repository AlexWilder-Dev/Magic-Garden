import { useClock } from '../lib/clock';
import { fmtTime, tillLabel } from '../lib/time';
import { OPEN_MIN } from '../data/venue';

export default function StatusChip({ className = '' }: { className?: string }) {
  const { status } = useClock();
  return (
    <span className={`status-chip ${status.open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="status-chip__dot" aria-hidden="true" />
      {status.open ? (
        <>
          <strong>Open</strong> <span>{tillLabel(status.closeMin)}</span>
        </>
      ) : (
        <>
          <strong>Closed</strong> <span>back {fmtTime(OPEN_MIN)}</span>
        </>
      )}
    </span>
  );
}
