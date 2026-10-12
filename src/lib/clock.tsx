import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { londonNow, parseAt, statusAt, type Status, type Wall } from './time';

interface ClockValue {
  now: Wall;
  status: Status;
  /** Raw ?at= value when the demo clock is in use. */
  demo: string | null;
  clearDemo: () => void;
}

const ClockContext = createContext<ClockValue | null>(null);

const readAt = (search: string) => new URLSearchParams(search).get('at');

export function ClockProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [real, setReal] = useState(() => londonNow());
  const [demoRaw, setDemoRaw] = useState<string | null>(() => readAt(location.search) ?? readAt(window.location.search));

  useEffect(() => {
    const id = window.setInterval(() => setReal(londonNow()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // ?at= inside the hash (#/?at=fri-21:30) can arrive after load.
  useEffect(() => {
    const fromHash = readAt(location.search);
    if (fromHash) setDemoRaw(fromHash);
  }, [location.search]);

  const override = useMemo(() => parseAt(demoRaw, real), [demoRaw, real]);
  const now = override ?? real;
  const status = useMemo(() => statusAt(now), [now]);

  const clearDemo = useCallback(() => {
    setDemoRaw(null);
    if (readAt(location.search)) {
      const p = new URLSearchParams(location.search);
      p.delete('at');
      navigate({ pathname: location.pathname, search: p.toString() }, { replace: true });
    }
    if (readAt(window.location.search)) {
      const u = new URL(window.location.href);
      u.searchParams.delete('at');
      window.history.replaceState(null, '', u.toString());
    }
  }, [location.pathname, location.search, navigate]);

  // The site follows the pub: a sunny café by day, lit like the garden after 5pm.
  const theme = status.phase === 'day' ? 'day' : 'night';
  useEffect(() => {
    document.documentElement.dataset.phase = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'day' ? '#f4ecdd' : '#16100c');
  }, [theme]);

  const value = useMemo(() => ({ now, status, demo: override ? demoRaw : null, clearDemo }), [now, status, override, demoRaw, clearDemo]);
  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export function useClock() {
  const v = useContext(ClockContext);
  if (!v) throw new Error('useClock outside ClockProvider');
  return v;
}
