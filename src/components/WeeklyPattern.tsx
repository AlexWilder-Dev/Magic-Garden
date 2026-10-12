import { WEEKLY } from '../data/events';
import { useClock } from '../lib/clock';
import { dowOf } from '../lib/time';

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function WeeklyBoard() {
  const { status } = useClock();
  const today = dowOf(status.night);
  return (
    <div className="board weekly-board">
      <h2 className="board__title">Every week at the Garden</h2>
      <dl>
        {WEEKLY.map((d, i) => (
          <div key={d.day} className={`weekly-board__row ${'quiet' in d ? 'is-quiet' : ''} ${ORDER[i] === today ? 'is-today' : ''}`}>
            <dt>{d.day}</dt>
            <dd>
              <strong>{d.title}</strong>
              <span>{d.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function WeeklyPattern({ title = 'Every week at the Garden' }: { title?: string }) {
  const { status } = useClock();
  const today = dowOf(status.night);
  return (
    <div className="weekly">
      <h3 className="weekly__title">{title}</h3>
      <dl className="weekly__grid">
        {WEEKLY.map((d, i) => (
          <div key={d.day} className={`weekly__day ${'quiet' in d ? 'is-quiet' : ''} ${ORDER[i] === today ? 'is-today' : ''}`}>
            <dt>{d.day}</dt>
            <dd>
              <strong>{d.title}</strong>
              <span>{d.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
