import { useRef } from "react";

interface SwipeGestureOptions {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: SwipeGestureOptions) {
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartY.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (deltaY > threshold && onSwipeUp) {
      onSwipeUp();
    } else if (deltaY < -threshold && onSwipeDown) {
      onSwipeDown();
    }

    touchStartY.current = null;
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}
