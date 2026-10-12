import type { CSSProperties } from 'react';
import manifest from '../data/images.json';

export type ImageName = keyof typeof manifest;

const BASE = `${import.meta.env.BASE_URL}img/`;

interface Props {
  name: ImageName;
  alt: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
  position?: string;
  style?: CSSProperties;
}

/** Responsive WebP from /public/img. Never upscales: the largest candidate is the original width. */
export default function Img({ name, alt, sizes = '100vw', className, eager, position, style }: Props) {
  const m = manifest[name];
  const srcSet = m.widths.map((w) => `${BASE}${name}-${w}.webp ${w}w`).join(', ');
  const fallback = m.widths.find((w) => w >= 800) ?? m.widths[m.widths.length - 1];
  const priority = eager ? ({ fetchpriority: 'high' } as Record<string, string>) : {};
  return (
    <img
      src={`${BASE}${name}-${fallback}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={{ objectPosition: position, ...style }}
      {...priority}
    />
  );
}

export const imageSize = (name: ImageName) => manifest[name];
