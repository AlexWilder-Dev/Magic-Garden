import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { MAIN, LIGHT, SIDES, PUDDINGS, type Diet, type Dish } from '../data/menu';
import { SetLists } from '../components/Parties';
import { useUI } from '../lib/ui';
import Img from '../components/Img';

const TABS = [
  { id: 'main', label: 'Main' },
  { id: 'light', label: 'Light bites' },
  { id: 'puddings', label: 'Puddings' },
  { id: 'party', label: 'Party menus' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const DIETS: { id: Diet; label: string }[] = [
  { id: 'V', label: 'Vegetarian' },
  { id: 'VG', label: 'Vegan' },
  { id: 'GF', label: 'Gluten free' },
];

const DIET_NAME: Record<Diet, string> = { V: 'Vegetarian', VG: 'Vegan', GF: 'Gluten free' };

/** V includes dishes marked VG: vegan dishes are vegetarian too. */
function fits(d: Dish, diets: Diet[]) {
  return diets.every((x) => (x === 'V' ? d.tags?.includes('V') || d.tags?.includes('VG') : d.tags?.includes(x)));
}

function DishList({ dishes, diets }: { dishes: Dish[]; diets: Diet[] }) {
  const shown = dishes.filter((d) => fits(d, diets));
  if (!shown.length) return null;
  return (
    <ul className="dishes dishes--full">
      {shown.map((d) => (
        <li key={d.name} className="dish">
          <span className="dish__name">
            {d.name}
            {d.tags?.map((t) => (
              <abbr key={t} className={`diet diet--${t.toLowerCase()}`} title={DIET_NAME[t]}>{t}</abbr>
            ))}
          </span>
          <span className="dish__leader" aria-hidden="true" />
          <span className="dish__price">{d.price}</span>
          {d.desc && <span className="dish__desc">{d.desc}</span>}
          {d.extras && <span className="dish__extras">{d.extras}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function Menu() {
  const [tab, setTab] = useState<TabId>('main');
  const [diets, setDiets] = useState<Diet[]>([]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { openBooking, setParty, goTo } = useUI();

  useEffect(() => {
    document.title = 'Menu · The Magic Garden';
  }, []);

  const toggle = (d: Diet) => setDiets((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const onTabKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    const next = TABS[(n + TABS.length) % TABS.length].id;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const lists: Record<Exclude<TabId, 'party'>, { title?: string; dishes: Dish[] }[]> = {
    main: [{ dishes: MAIN }],
    light: [{ dishes: LIGHT }, { title: 'Sides', dishes: SIDES }],
    puddings: [{ dishes: PUDDINGS }],
  };

  const emptyNote =
    tab !== 'party' && lists[tab].every((g) => !g.dishes.some((d) => fits(d, diets)))
      ? 'Nothing on this page matches all of those. Try fewer filters.'
      : null;

  return (
    <div className="page menu-page">
      <header className="page-head wrap menu-page__head">
        <div>
          <p className="eyebrow">Food at the Garden</p>
          <h1 className="display-h1">The menu</h1>
          <p className="page-head__lede">Made for reading on your phone at the table. Prices per dish.</p>
        </div>
        <figure className="menu-page__photo">
          <Img name="inside-the-bar" alt="The bar: hand pumps, roses and glasses hanging above" sizes="(min-width: 960px) 420px, 92vw" eager />
        </figure>
      </header>

      <div className="wrap menu-page__body">
        <div className="tabs" role="tablist" aria-label="Menu sections" onKeyDown={onTabKey}>
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[t.id] = el)}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab !== 'party' && (
          <div className="chips chips--diet" role="group" aria-label="Dietary filters">
            {DIETS.map((d) => (
              <button key={d.id} type="button" className="chip" aria-pressed={diets.includes(d.id)} onClick={() => toggle(d.id)}>
                <abbr title={d.label}>{d.id}</abbr> {d.label}
              </button>
            ))}
            {diets.length > 0 && (
              <button type="button" className="chip chip--clear" onClick={() => setDiets([])}>Clear</button>
            )}
          </div>
        )}

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="menu-panel" tabIndex={0}>
          {tab === 'party' ? (
            <>
              <p className="menu-panel__note">All party menus are priced per person, for groups of 15 or more.</p>
              <SetLists
                onPick={(id) => {
                  setParty({ menu: id, guests: 15 });
                  goTo('parties-form');
                }}
              />
            </>
          ) : (
            <>
              {lists[tab].map((g, i) => (
                <div key={i} className="menu-group">
                  {g.title && g.dishes.some((d) => fits(d, diets)) && <h2 className="menu-group__title">{g.title}</h2>}
                  <DishList dishes={g.dishes} diets={diets} />
                </div>
              ))}
              {emptyNote && <p className="menu-panel__note">{emptyNote}</p>}
            </>
          )}
        </div>

        <div className="menu-page__book">
          <p>Hungry now?</p>
          <button type="button" className="btn btn--red" onClick={() => openBooking({ occasion: 'Dinner' })}>Book a table</button>
        </div>
      </div>
    </div>
  );
}
