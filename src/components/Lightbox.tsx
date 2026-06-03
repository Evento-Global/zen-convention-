/**
 * Image lightbox — full-screen viewer launched from PDP gallery cells.
 *
 *  • Portal mounted to <body> so it ignores ancestor stacking contexts.
 *  • Keyboard: ←/→ navigate, Esc closes.
 *  • Touch / pen / mouse: horizontal swipe = prev/next, swipe-down = close.
 *  • Click outside the figure closes; nav / close buttons stop bubbling.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { getGalleryBaseRate } from '../data/galleryRates';
import { resolveImageSrc } from '../data/sections';
import { useSwipe } from '../hooks/useSwipe';
import { formatListedPrice } from '../utils/pricing';
import './Lightbox.css';

interface LightboxProps {
  readonly isOpen: boolean;
  readonly seeds: readonly string[];
  readonly optionId?: string;
  readonly activeIndex: number;
  readonly title: string;
  readonly subtitle: string;
  readonly onClose: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

const SWIPE_DAMP = 0.42;
const MAX_VISIBLE_DRAG_X = 120;
const MAX_VISIBLE_DRAG_Y = 160;

export function Lightbox({
  isOpen,
  seeds,
  optionId,
  activeIndex,
  title,
  subtitle,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, onNext, onPrev]);

  const handleBackdrop = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  const stopPropagation = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => event.stopPropagation(),
    [],
  );

  const swipe = useSwipe<HTMLDivElement>({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    onSwipeDown: onClose,
    threshold: 56,
    maxOffAxis: 70,
  });

  const dragStyle = useMemo<CSSProperties | undefined>(() => {
    if (!swipe.dragging) return undefined;
    const horizontal = Math.abs(swipe.dx) > Math.abs(swipe.dy);
    if (horizontal) {
      const tx = Math.max(-MAX_VISIBLE_DRAG_X, Math.min(MAX_VISIBLE_DRAG_X, swipe.dx * SWIPE_DAMP));
      return { transform: `translate3d(${tx}px, 0, 0)`, transition: 'none' };
    }
    if (swipe.dy > 0) {
      const ty = Math.min(MAX_VISIBLE_DRAG_Y, swipe.dy * SWIPE_DAMP);
      const fade = Math.max(0, 1 - swipe.dy / 480);
      return {
        transform: `translate3d(0, ${ty}px, 0)`,
        opacity: fade,
        transition: 'none',
      };
    }
    return undefined;
  }, [swipe.dragging, swipe.dx, swipe.dy]);

  if (!isOpen) return null;
  const activeSeed = seeds[activeIndex];
  if (!activeSeed) return null;

  const counterCurrent = String(activeIndex + 1).padStart(2, '0');
  const counterTotal = String(seeds.length).padStart(2, '0');
  const refNum = activeIndex + 1;
  const baseRate = optionId ? getGalleryBaseRate(optionId, refNum) : undefined;
  const listedLabel =
    baseRate !== undefined ? formatListedPrice(baseRate) : null;

  return createPortal(
    <div
      className="lb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image ${counterCurrent} of ${counterTotal}`}
      onClick={handleBackdrop}
    >
      <header className="lb-header" onClick={stopPropagation}>
        <div className="lb-header-meta">
          <span className="lb-header-title">{title}</span>
          <span className="lb-header-dot" aria-hidden />
          <span className="lb-header-sub">{subtitle}</span>
        </div>
        <div className="lb-header-actions">
          <span className="lb-counter" aria-live="polite">
            {counterCurrent} / {counterTotal}
          </span>
          <button
            type="button"
            className="lb-close"
            aria-label="Close gallery"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div
        className="lb-stage"
        ref={swipe.ref}
        onClick={handleBackdrop}
        role="presentation"
      >
        <button
          type="button"
          className="lb-nav lb-nav--prev"
          aria-label="Previous image"
          onClick={onPrev}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <figure
          className="lb-figure"
          onClick={stopPropagation}
          style={dragStyle}
        >
          {imgFailed ? (
            <div className="lb-fallback" role="img" aria-label="Image unavailable" />
          ) : (
            <img
              key={activeSeed}
              src={resolveImageSrc(activeSeed, 1600, 1200)}
              alt={`${title} reference ${counterCurrent}`}
              draggable={false}
              onError={() => setImgFailed(true)}
            />
          )}
          <figcaption className="lb-caption">
            <span className="lb-caption-tag">REF · {counterCurrent}</span>
            {listedLabel ? (
              <span className="lb-caption-price">{listedLabel}</span>
            ) : null}
            <span className="lb-caption-text">
              {title} · {subtitle}
            </span>
          </figcaption>
        </figure>

        <button
          type="button"
          className="lb-nav lb-nav--next"
          aria-label="Next image"
          onClick={onNext}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="lb-swipe-hint" aria-hidden>
          Swipe ↔ to browse · ↓ to close
        </span>
      </div>

      <footer className="lb-strip" onClick={stopPropagation}>
        {seeds.map((seed, i) => (
          <button
            key={`${i}-${seed}`}
            type="button"
            className={
              i === activeIndex
                ? 'lb-strip-thumb lb-strip-thumb--active'
                : 'lb-strip-thumb'
            }
            aria-label={`Go to image ${i + 1}`}
            onClick={() => {
              const diff = i - activeIndex;
              if (diff === 0) return;
              if (diff > 0) {
                for (let s = 0; s < diff; s += 1) onNext();
              } else {
                for (let s = 0; s < -diff; s += 1) onPrev();
              }
            }}
          >
            <img
              src={resolveImageSrc(seed, 160, 160)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </footer>
    </div>,
    document.body,
  );
}
