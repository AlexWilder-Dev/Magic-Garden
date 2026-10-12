import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * The vine from the logo (and the front of the building), drawn by hand across each
 * section boundary. It grows as you scroll and sprouts leaves where it has reached.
 */

interface Props {
  /** Where it enters at the top, as a fraction of the width. */
  from: number;
  /** Where it leaves at the bottom. */
  to: number;
  seed?: number;
  height?: number;
  className?: string;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];
const f = (n: number) => n.toFixed(1);

function smooth(pts: Pt[]) {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

function buildVine(w: number, h: number, from: number, to: number, seed: number) {
  // x only ever moves one way, so the stem never knots back on itself; y swings like a climbing stem.
  const r = rng(seed);
  const n = w < 640 ? 4 : 6;
  const step = (to - from) / n;
  const phase = r() * Math.PI * 2;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let x = from + step * i;
    let y = t * h;
    if (i > 0 && i < n) {
      x += step * (r() - 0.5) * 0.5;
      y += Math.sin(phase + t * Math.PI * 2.2) * h * 0.32;
    }
    x = Math.min(0.97, Math.max(0.03, x));
    pts.push([x * w, Math.max(6, Math.min(h - 6, y))]);
  }
  pts[0][1] = 0;
  pts[n][1] = h;
  return smooth(pts);
}

interface Leaf {
  x: number;
  y: number;
  angle: number;
  at: number;
  s: number;
}

interface Curl {
  d: string;
  at: number;
}

function curlAt(x: number, y: number, angle: number, side: number, size: number) {
  // A small tendril: out from the stem, then a tight spiral, like the end of the logo's vine.
  const a = (angle + side * 70) * (Math.PI / 180);
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const px = -uy * side;
  const py = ux * side;
  const P = (u: number, v: number): string => `${f(x + ux * u * size + px * v * size)},${f(y + uy * u * size + py * v * size)}`;
  return `M${f(x)},${f(y)} C${P(0.5, 0.1)} ${P(0.9, 0.3)} ${P(1, 0.62)} C${P(1.08, 0.95)} ${P(0.72, 1.02)} ${P(0.64, 0.8)} C${P(0.58, 0.62)} ${P(0.78, 0.55)} ${P(0.84, 0.7)}`;
}

function LeafShape({ leaf, progress, animate }: { leaf: Leaf; progress: MotionValue<number>; animate: boolean }) {
  const scale = useTransform(progress, [leaf.at - 0.01, leaf.at + 0.07], [0, leaf.s]);
  return (
    <g transform={`translate(${f(leaf.x)} ${f(leaf.y)}) rotate(${f(leaf.angle)})`}>
      <motion.g style={{ scale: animate ? scale : leaf.s, originX: 0, originY: 0.5 }}>
        <path className="vine__leaf" d="M0,0 C3,-7 11,-11 23,-8 C19,-1 12,5 0,0 Z" />
        <path className="vine__rib" d="M2,-0.6 C8,-3 14,-5.4 20,-7.2" />
      </motion.g>
    </g>
  );
}

export default function VineLine({ from, to, seed = 7, height = 150, className = '' }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [w, setW] = useState(0);
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [curls, setCurls] = useState<Curl[]>([]);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start 0.92', 'end 0.4'] });

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = useMemo(() => (w ? buildVine(w, height, from, to, seed) : ''), [w, height, from, to, seed]);

  useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p || !d) return;
    const len = p.getTotalLength();
    const r = rng(seed * 31 + 5);
    const count = Math.max(5, Math.min(14, Math.round(len / 80)));
    const out: Leaf[] = [];
    const curlsOut: Curl[] = [];
    for (let i = 0; i < count; i++) {
      const at = 0.06 + (0.88 * (i + r() * 0.5)) / count;
      const a = p.getPointAtLength(at * len);
      const b = p.getPointAtLength(Math.min(len, at * len + 1));
      const tangent = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const side = i % 2 === 0 ? -1 : 1;
      out.push({ x: a.x, y: a.y, angle: tangent + side * (38 + r() * 30), at, s: 0.85 + r() * 0.6 });
      if (i % 4 === 2) curlsOut.push({ d: curlAt(a.x, a.y, tangent, -side, 16 + r() * 8), at });
    }
    setLeaves(out);
    setCurls(curlsOut);
  }, [d, seed]);

  const animate = !reduce;

  return (
    <div ref={wrap} className={`vine ${className}`} style={{ height }} aria-hidden="true">
      {w > 0 && (
        <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} overflow="visible">
          <motion.path ref={pathRef} className="vine__stem" d={d} style={animate ? { pathLength: scrollYProgress } : undefined} />
          {curls.map((c, i) => (
            <Curly key={i} d={c.d} at={c.at} progress={scrollYProgress} animate={animate} />
          ))}
          {leaves.map((leaf, i) => (
            <LeafShape key={i} leaf={leaf} progress={scrollYProgress} animate={animate} />
          ))}
        </svg>
      )}
    </div>
  );
}

function Curly({ d, at, progress, animate }: { d: string; at: number; progress: MotionValue<number>; animate: boolean }) {
  const len = useTransform(progress, [at, at + 0.12], [0, 1]);
  return <motion.path className="vine__curl" d={d} style={animate ? { pathLength: len } : undefined} />;
}
