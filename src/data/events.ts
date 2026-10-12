import { dowOf, type DateKey } from '../lib/time';

export type Filter = 'World' | 'Latin' | 'Brazilian' | 'Jazz' | 'Funk & Soul' | 'Indie' | 'Folk' | 'DJs' | 'Quiz';
export const FILTER_ORDER: Filter[] = ['World', 'Latin', 'Brazilian', 'Jazz', 'Funk & Soul', 'Indie', 'Folk', 'DJs', 'Quiz'];

export type Entry =
  | { kind: 'free' }
  | { kind: 'quiz' }
  | { kind: 'tickets'; price?: string; note?: string }
  | { kind: 'tba' };

export type Tier = 'headline' | 'mid' | 'small';

export interface GigEvent {
  id: string;
  date: DateKey;
  /** Minutes after midnight; null when the start time isn't published. */
  start: number | null;
  /** Minutes after midnight of `date`; past 1440 means after midnight. */
  end: number;
  name: string;
  support?: string;
  presenter?: string;
  origin?: string;
  blurb: [string, string];
  genres: string[];
  filters: Filter[];
  entry: Entry;
  url?: string;
  image?: string;
  tier: Tier;
  /** Act not announced yet (filled from the weekly pattern). */
  tba?: boolean;
  pattern?: boolean;
}

const eventbrite = (id: string) => `https://www.eventbrite.co.uk/e/${id}`;
const T = (h: number, m = 0) => h * 60 + m;

export const EVENTS: GigEvent[] = [
  {
    id: 'souleymane-diabate',
    date: '2026-10-12', start: T(19, 30), end: T(23, 30),
    presenter: 'World Music Method presents',
    name: 'Souleymane Diabate', origin: 'Ivory Coast',
    blurb: ['Master balafonist and composer from Abobo.', 'Leads the ensemble Djarabikan Balafon.'],
    genres: ['World', 'Balafon', 'Ivory Coast'], filters: ['World'],
    entry: { kind: 'free' }, url: eventbrite('2002294955111'), image: 'ev-souleymane', tier: 'mid',
  },
  {
    id: 'pub-quiz-14-oct',
    date: '2026-10-14', start: T(19, 30), end: T(23, 30),
    name: 'Pub Quiz',
    blurb: ['Our Wednesday pub quiz.', 'Free entry, £2 per person to play.'],
    genres: ['Quiz'], filters: ['Quiz'],
    entry: { kind: 'quiz' }, url: eventbrite('1996225121074'), image: 'ev-quiz-1', tier: 'small',
  },
  {
    id: 'casa-del-ritmo-resistencia-indigena',
    date: '2026-10-15', start: T(19, 30), end: T(23, 30),
    name: 'Casa del Ritmo', support: 'featuring Resistencia Indigena',
    blurb: ['New Latin acts, every third Thursday of the month.', 'This month: Resistencia Indigena.'],
    genres: ['Latin'], filters: ['Latin', 'World'],
    entry: { kind: 'free' }, url: eventbrite('2001200471481'), image: 'ev-casa-del-ritmo', tier: 'mid',
  },
  {
    id: 'joao-menezes-quartet',
    date: '2026-10-16', start: T(21), end: T(26),
    name: 'João Menezes Quartet', support: '& DJ Jamie Moon',
    blurb: ['Brazilian rhythms meet jazz.', 'Led by a Portuguese guitarist, singer and composer, a Guildhall graduate.'],
    genres: ['Brazilian', 'Jazz', 'DJ'], filters: ['Brazilian', 'Jazz', 'DJs'],
    entry: { kind: 'tickets' }, url: eventbrite('2002440297835'), image: 'ev-joao-menezes', tier: 'headline',
  },
  {
    id: 'the-sauna-social',
    date: '2026-10-17', start: T(20), end: T(26),
    name: 'The Sauna Social',
    blurb: [
      'The Lost Horizon sauna in the garden, towel hire included, with folk music in the sauna garden.',
      'Plus a secret live set in the pub and a DJ till late.',
    ],
    genres: ['Sauna', 'Folk', 'DJ'], filters: ['Folk', 'DJs'],
    entry: { kind: 'tickets', price: '£35', note: 'Towel hire included' },
    url: 'https://www.tickettailor.com/events/losthorizon/2341729', image: 'ev-sauna-social', tier: 'headline',
  },
  {
    id: 'divyarup',
    date: '2026-10-19', start: T(19, 30), end: T(23, 30),
    presenter: 'World Music Method presents',
    name: 'Divyarup', origin: 'Brazil',
    blurb: ['Soulful Brazilian funky jazz.', 'Has played the Roundhouse and the Royal Automobile Club.'],
    genres: ['Brazilian', 'Funky jazz'], filters: ['World', 'Brazilian', 'Jazz', 'Funk & Soul'],
    entry: { kind: 'free' }, url: eventbrite('2002077092478'), image: 'ev-divyarup', tier: 'mid',
  },
  {
    id: 'pub-quiz-21-oct',
    date: '2026-10-21', start: T(19, 30), end: T(23, 30),
    name: 'Pub Quiz',
    blurb: ['Our Wednesday pub quiz.', 'Free entry, £2 per person to play.'],
    genres: ['Quiz'], filters: ['Quiz'],
    entry: { kind: 'quiz' }, url: eventbrite('1996226277533'), image: 'ev-quiz-2', tier: 'small',
  },
  {
    id: 'koikoi',
    date: '2026-10-22', start: T(19, 30), end: T(23, 30),
    name: 'KOIKOI', origin: 'Belgrade',
    blurb: ['Belgrade band mixing indie rock, post-punk and electronics.', '180+ shows in 17 countries.'],
    genres: ['Indie rock', 'Post-punk', 'Electronics'], filters: ['Indie'],
    entry: { kind: 'free' }, url: eventbrite('2000969458515'), image: 'ev-koikoi', tier: 'mid',
  },
  {
    id: 'they-say-jump',
    date: '2026-10-23', start: T(21), end: T(26),
    name: 'They Say Jump', support: 'Lords of Veg Funk & DJ Richio Suzuki',
    blurb: ['Party band whose members have played with Stormzy, Bastille and Paloma Faith.', 'With Lords of Veg Funk and DJ Richio Suzuki till 2am.'],
    genres: ['Party band', 'Funk', 'DJ'], filters: ['Funk & Soul', 'DJs'],
    entry: { kind: 'tickets' }, url: eventbrite('1991702424567'), image: 'ev-they-say-jump', tier: 'headline',
  },
  {
    id: 'living-sounds',
    date: '2026-10-24', start: T(19), end: T(26),
    presenter: 'Funk & Soul Night',
    name: 'Living Sounds', support: '& DJ Luca P',
    blurb: ['Afro, funk, soul and rock powerhouse.', 'Formed over 20 years ago by Derane Obika.'],
    genres: ['Afro', 'Funk', 'Soul', 'Rock'], filters: ['Funk & Soul', 'DJs'],
    entry: { kind: 'tickets' }, url: eventbrite('2000464493150'), image: 'ev-living-sounds', tier: 'headline',
  },
];

/** Third Thursday of the month: Casa del Ritmo. */
const isThirdThursday = (date: DateKey) => {
  const d = Number(date.slice(8, 10));
  return d >= 15 && d <= 21;
};

/** Fills nights beyond the dated list from the weekly pattern. Tue and Sun have no listed show. */
export function patternEvent(date: DateKey): GigEvent | null {
  const dow = dowOf(date);
  const base = { date, pattern: true as const };
  switch (dow) {
    case 1:
      return {
        ...base, id: `wmm-${date}`, start: T(19, 30), end: T(23, 30),
        presenter: 'World Music Method', name: 'World Music Method',
        blurb: ['Our Monday world music night.', 'Act to be announced.'],
        genres: ['World'], filters: ['World'], entry: { kind: 'free' }, tier: 'mid', tba: true,
      };
    case 3:
      return {
        ...base, id: `quiz-${date}`, start: T(19, 30), end: T(23, 30), name: 'Pub Quiz',
        blurb: ['Our Wednesday pub quiz.', 'Free entry, £2 per person to play.'],
        genres: ['Quiz'], filters: ['Quiz'], entry: { kind: 'quiz' }, image: 'ev-quiz-1', tier: 'small',
      };
    case 4:
      return isThirdThursday(date)
        ? {
            ...base, id: `casa-${date}`, start: T(19, 30), end: T(23, 30), name: 'Casa del Ritmo',
            blurb: ['New Latin acts, every third Thursday of the month.', 'Line-up to be announced.'],
            genres: ['Latin'], filters: ['Latin', 'World'], entry: { kind: 'free' }, tier: 'mid', tba: true,
          }
        : {
            ...base, id: `thu-${date}`, start: T(19, 30), end: T(23, 30), name: 'Free live music',
            blurb: ['Free live music, every Thursday.', 'Act to be announced.'],
            genres: ['Live music'], filters: [], entry: { kind: 'free' }, tier: 'mid', tba: true,
          };
    case 5:
    case 6:
      return {
        ...base, id: `weekend-${date}`, start: null, end: T(26), name: 'Festival bands & DJs',
        blurb: ['Festival bands and DJs till 2am.', 'Line-up to be announced.'],
        genres: ['Bands', 'DJs'], filters: ['DJs'], entry: { kind: 'tba' }, tier: 'headline', tba: true,
      };
    default:
      return null;
  }
}

export const WEEKLY = [
  { day: 'Mon', title: 'World Music Method', detail: '7:30–11:30pm · Free entry' },
  { day: 'Tue', title: 'The garden', detail: 'No listed show. The garden’s open.', quiet: true },
  { day: 'Wed', title: 'Pub Quiz', detail: '7:30–11:30pm · Free entry, £2 per person to play' },
  { day: 'Thu', title: 'Free live music', detail: '7:30–11:30pm · Third Thursday: Casa del Ritmo, new Latin acts' },
  { day: 'Fri', title: 'Festival bands & DJs', detail: 'Till 2am' },
  { day: 'Sat', title: 'Festival bands & DJs', detail: 'Till 2am' },
  { day: 'Sun', title: 'The garden', detail: 'No listed show. The garden’s open.', quiet: true },
] as const;

export const fullTitle = (e: GigEvent) => (e.support ? `${e.name} ${e.support}` : e.name);
