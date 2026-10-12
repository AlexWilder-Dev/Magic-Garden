/**
 * The ogee arch cut into the garden café's wooden screens, used as a photo frame.
 * Units are relative to the framed box.
 */
export const ARCH_PATH =
  'M0,1 L0,0.3 C0,0.19 0.16,0.15 0.29,0.11 C0.4,0.075 0.47,0.045 0.5,0 C0.53,0.045 0.6,0.075 0.71,0.11 C0.84,0.15 1,0.19 1,0.3 L1,1 Z';

export default function ArchDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
          <path d={ARCH_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}
