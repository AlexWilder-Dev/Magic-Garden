import { useClock } from '../lib/clock';
import { fmtDay, fmtTime } from '../lib/time';

export default function DemoBadge() {
  const { demo, now, clearDemo } = useClock();
  if (!demo) return null;
  return (
    <div className="demo-badge" role="status">
      <span>
        Demo clock: <strong>{fmtDay(now.key)}, {fmtTime(now.min)}</strong>
      </span>
      <button type="button" onClick={clearDemo}>Use real time</button>
    </div>
  );
}
