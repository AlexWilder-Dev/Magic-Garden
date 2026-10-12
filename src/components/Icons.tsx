import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false, ...p,
});

export const IconPhone = (p: P) => (
  <svg {...base(p)}><path d="M5 3.5h3.2l1.6 4.2-2 1.3a11.5 11.5 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.8 1.8 0 0 1-1.9 1.8A16.6 16.6 0 0 1 3.2 5.4 1.8 1.8 0 0 1 5 3.5Z" /></svg>
);
export const IconCalendar = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /><path d="M8 14h3" /></svg>
);
export const IconPlate = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="13" r="6.5" /><path d="M4 3v6a1.5 1.5 0 0 0 1.5 1.5M4 10.5V21M20 3c-1.5 1-2 3-2 5s.6 3 2 3v10" /></svg>
);
/** Two notes: tonight's music. */
export const IconNote = (p: P) => (
  <svg {...base(p)}><path d="M9 18V5.5l11-2V16" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></svg>
);
export const IconArrow = (p: P) => (
  <svg {...base(p)}><path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" /></svg>
);
export const IconExternal = (p: P) => (
  <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const IconClose = (p: P) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconChevron = ({ dir = 'right', ...p }: P & { dir?: 'left' | 'right' }) => (
  <svg {...base(p)}><path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} /></svg>
);
export const IconPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
);
export const IconMinus = (p: P) => (
  <svg {...base(p)}><path d="M6 12h12" /></svg>
);
export const IconPlus = (p: P) => (
  <svg {...base(p)}><path d="M12 6v12M6 12h12" /></svg>
);
export const IconList = (p: P) => (
  <svg {...base(p)}><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></svg>
);
export const IconPoster = (p: P) => (
  <svg {...base(p)}><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M8 7.5h8M7.5 11.5h9M9 15h6M10 18h4" /></svg>
);
export const IconInstagram = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" /></svg>
);
export const IconFacebook = (p: P) => (
  <svg {...base(p)}><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.4l.6-3.5h-3V9a.5.5 0 0 1 .5-.5Z" /></svg>
);
export const IconX = (p: P) => (
  <svg {...base(p)}><path d="M4 4l16 16M20 4 4 20" strokeWidth={1.6} /></svg>
);
