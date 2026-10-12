import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { IconClose } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Bottom sheet on phones, a raised card on desktop. Drag the grip down to dismiss. */
export default function Sheet({ open, onClose, labelledBy, children, className = '' }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const heading = panel.current?.querySelector<HTMLElement>(`#${labelledBy}`);
      (heading ?? panel.current)?.focus({ preventScroll: true });
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restore.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, labelledBy]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={`sheet ${className}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 340 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 650) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__grip" onPointerDown={(e) => drag.start(e)} aria-hidden="true">
              <span />
            </div>
            <button type="button" className="sheet__close" onClick={onClose} aria-label="Close">
              <IconClose />
            </button>
            <div className="sheet__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
