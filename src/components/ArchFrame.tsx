import type { ReactNode } from 'react';
import { ARCH_PATH } from './ArchDefs';

const outline = ARCH_PATH.replace(/(\d*\.?\d+)/g, (n) => String(Math.round(Number(n) * 1000) / 10));

export default function ArchFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`arch ${className}`}>
      <div className="arch__clip">{children}</div>
      <svg className="arch__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={outline} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
