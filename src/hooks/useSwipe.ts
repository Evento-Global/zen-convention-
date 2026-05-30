import { useCallback, useEffect, useRef, useState } from 'react';

interface SwipeOptions {
  readonly onSwipeLeft?: () => void;
  readonly onSwipeRight?: () => void;
  readonly onSwipeDown?: () => void;
  readonly threshold?: number;
  readonly maxOffAxis?: number;
}

interface SwipeState {
  readonly dragging: boolean;
  readonly dx: number;
  readonly dy: number;
}

/**
 * Pointer Events-based swipe detection (touch + mouse + pen).
 *
 * Returns ref + live drag offsets so the consumer can render a
 * transient transform during the gesture.
 */
export function useSwipe<T extends HTMLElement>(options: SwipeOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeDown,
    threshold = 48,
    maxOffAxis = 80,
  } = options;

  const ref = useRef<T | null>(null);
  const start = useRef<{ x: number; y: number; id: number; time: number } | null>(null);
  const [state, setState] = useState<SwipeState>({ dragging: false, dx: 0, dy: 0 });

  const reset = useCallback(() => {
    start.current = null;
    setState({ dragging: false, dx: 0, dy: 0 });
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId, time: e.timeStamp };
      setState({ dragging: true, dx: 0, dy: 0 });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!start.current || e.pointerId !== start.current.id) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      setState({ dragging: true, dx, dy });
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (!start.current || e.pointerId !== start.current.id) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      const horizontal = Math.abs(dx) > Math.abs(dy);
      if (horizontal && Math.abs(dx) >= threshold && Math.abs(dy) <= maxOffAxis) {
        if (dx < 0) onSwipeLeft?.();
        else onSwipeRight?.();
      } else if (!horizontal && dy >= threshold * 1.4 && Math.abs(dx) <= maxOffAxis) {
        onSwipeDown?.();
      }
      reset();
    };

    node.addEventListener('pointerdown', onPointerDown);
    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerup', onPointerEnd);
    node.addEventListener('pointercancel', reset);
    node.addEventListener('pointerleave', reset);

    return () => {
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', onPointerEnd);
      node.removeEventListener('pointercancel', reset);
      node.removeEventListener('pointerleave', reset);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeDown, threshold, maxOffAxis, reset]);

  return { ref, ...state };
}
