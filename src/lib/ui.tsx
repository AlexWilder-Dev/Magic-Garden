import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { GigEvent } from '../data/events';
import type { DateKey } from './time';

export const AREAS = ['Inside', 'Conservatory', 'Garden, covered', 'Garden, open sky', 'Private seating area'] as const;
export const OCCASIONS = ['Drinks', 'Lunch', 'Dinner', 'Birthday', 'Gig night', 'Work do'] as const;
export type Area = (typeof AREAS)[number];
export type Occasion = (typeof OCCASIONS)[number];

export interface BookingPreset {
  date?: DateKey;
  area?: Area;
  occasion?: Occasion;
}

export interface PartyPrefill {
  date?: DateKey;
  guests?: number;
  menu?: string;
}

interface UIValue {
  booking: BookingPreset | null;
  openBooking: (preset?: BookingPreset) => void;
  closeBooking: () => void;
  sheet: { night: DateKey; event: GigEvent } | null;
  openEvent: (night: DateKey, event: GigEvent) => void;
  closeEvent: () => void;
  party: PartyPrefill | null;
  setParty: (p: PartyPrefill | null) => void;
  goTo: (id: string) => void;
}

const UIContext = createContext<UIValue | null>(null);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  return true;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingPreset | null>(null);
  const [sheet, setSheet] = useState<UIValue['sheet']>(null);
  const [party, setParty] = useState<PartyPrefill | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = useCallback(
    (id: string) => {
      if (location.pathname === '/') scrollToId(id);
      else navigate('/', { state: { scrollTo: id } });
    },
    [location.pathname, navigate],
  );

  const value = useMemo<UIValue>(
    () => ({
      booking,
      openBooking: (preset = {}) => {
        setSheet(null);
        setBooking(preset);
      },
      closeBooking: () => setBooking(null),
      sheet,
      openEvent: (night, event) => setSheet({ night, event }),
      closeEvent: () => setSheet(null),
      party,
      setParty,
      goTo,
    }),
    [booking, sheet, party, goTo],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const v = useContext(UIContext);
  if (!v) throw new Error('useUI outside UIProvider');
  return v;
}
