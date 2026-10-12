import Img, { type ImageName } from './Img';

interface Piece {
  img: ImageName;
  title: string;
  note: string;
  alt: string;
  cls: string;
  sizes: string;
  position?: string;
}

const PIECES: Piece[] = [
  {
    img: 'inside-bar-night', cls: 'hang--bar', title: 'The indoor bar', note: 'Lit up at night: fairy lights, hanging lanterns, a wall of bottles.',
    alt: 'The indoor bar at night, strung with fairy lights under a shelf of curios', sizes: '(min-width: 960px) 640px, 100vw',
  },
  {
    img: 'inside-conservatory', cls: 'hang--cons', title: 'The conservatory', note: 'Glass roof, wooden floor, light all day.',
    alt: 'The conservatory: a glass roof over long tables and white chairs, sun on the floorboards', sizes: '(min-width: 960px) 380px, 70vw',
  },
  {
    img: 'misc-2', cls: 'hang--piano', title: 'The piano', note: 'Painted head to toe.',
    alt: 'An upright piano spray-painted with swirls, flowers and a teapot', sizes: '(min-width: 960px) 420px, 80vw',
  },
  {
    img: 'inside-darts', cls: 'hang--darts', title: 'Darts', note: 'With armchairs, naturally.',
    alt: 'The darts corner: a dartboard in a wooden cabinet above two velvet armchairs', sizes: '(min-width: 960px) 320px, 60vw', position: '100% 45%',
  },
  {
    img: 'inside-stage-fireplace', cls: 'hang--stage', title: 'The stage by the fireplace', note: 'Green carpet and red velvet curtains, ready for the band.',
    alt: 'The stage: a raised green platform with red velvet curtains and a vintage sofa', sizes: '(min-width: 960px) 760px, 100vw',
  },
];

export default function Inside() {
  return (
    <section id="inside" className="section inside" aria-labelledby="inside-title">
      <div className="wrap">
        <div className="inside__intro">
          <div>
            <p className="eyebrow">The pub itself</p>
            <h2 id="inside-title" className="display-h2">Inside</h2>
          </div>
          <figure className="inside__facade">
            <Img name="home-1" alt="The front of The Magic Garden at night, its brick walls washed in purple light, with painted trees climbing the ground floor" sizes="(min-width: 960px) 760px, 100vw" position="40% 50%" />
          </figure>
          <p className="inside__story">
            Rebuilt between the wars to designs by Alfred W. Blomfield, Watney’s house architect, who is also known for the French House in Soho.{' '}
            <strong>Two impressive bay windows survive</strong>; inside, it was opened out. Now it holds a bar, a stage by the fireplace, a painted piano, a conservatory and a darts corner.
          </p>
        </div>

        <div className="hang">
          {PIECES.map((p) => (
            <figure key={p.title} className={`hang__piece ${p.cls}`}>
              <div className="hang__frame">
                <Img name={p.img} alt={p.alt} sizes={p.sizes} position={p.position} />
              </div>
              <figcaption className="hang__plate">
                <strong>{p.title}</strong>
                <span>{p.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
