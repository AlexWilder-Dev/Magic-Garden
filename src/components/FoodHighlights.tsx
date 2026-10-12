import { Link } from 'react-router-dom';
import Img from './Img';
import { IconArrow } from './Icons';
import { MAIN, LIGHT, PUDDINGS, type Dish } from '../data/menu';

const pick = (list: Dish[], name: string) => list.find((d) => d.name === name)!;

const HIGHLIGHTS: Dish[] = [
  pick(MAIN, 'The Magic Burger'),
  pick(MAIN, 'Fish & chips'),
  pick(MAIN, 'Cauliflower steak'),
  pick(MAIN, 'Steak of the week'),
  pick(LIGHT, 'Buffalo cauliflower wings'),
  pick(PUDDINGS, 'Sticky toffee pudding'),
];

export default function FoodHighlights() {
  return (
    <section id="food" className="section food" aria-labelledby="food-title">
      <div className="wrap food__inner">
        <figure className="food__photo">
          <Img name="inside-restaurant-2" alt="A candlelit table laid for dinner in the restaurant, big painted portraits on the walls" sizes="(min-width: 960px) 640px, 100vw" position="45% 60%" />
        </figure>
        <div className="menu-card">
          <p className="eyebrow">From the kitchen</p>
          <h2 id="food-title" className="display-h2">Something to eat</h2>
          <ul className="dishes">
            {HIGHLIGHTS.map((d) => (
              <li key={d.name} className="dish">
                <span className="dish__name">
                  {d.name}
                  {d.tags?.map((t) => (
                    <abbr key={t} className={`diet diet--${t.toLowerCase()}`} title={t === 'V' ? 'Vegetarian' : t === 'VG' ? 'Vegan' : 'Gluten free'}>{t}</abbr>
                  ))}
                </span>
                <span className="dish__leader" aria-hidden="true" />
                <span className="dish__price">{d.price}</span>
                {d.desc && <span className="dish__desc">{d.desc}</span>}
              </li>
            ))}
          </ul>
          <div className="menu-card__foot">
            <Link to="/menu" className="btn btn--red">
              The full menu <IconArrow width={18} height={18} />
            </Link>
            <p>Mains, light bites, puddings and party menus, all readable on your phone.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
