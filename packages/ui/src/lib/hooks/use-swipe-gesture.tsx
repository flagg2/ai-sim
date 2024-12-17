import { useRef, useEffect } from "react";
import { useIsTouchDevice } from "./use-is-touch-device";

interface SwipeGestureOptions {
  onSwipeUp?: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeUp,
  threshold = 50,
}: SwipeGestureOptions) {
  const { isTouchDevice } = useIsTouchDevice();
  const startY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = startY.current - touchEndY;

    if (deltaY > threshold && onSwipeUp) {
      onSwipeUp();
    }

    startY.current = null;
  };

  const cleanupListeners = () => {
    startY.current = null;
    isDragging.current = false;
    document.removeEventListener("mousemove", handleGlobalMouseMove, {
      capture: true,
    });
    document.removeEventListener("mouseup", handleGlobalMouseUp, {
      capture: true,
    });
  };

  useEffect(() => {
    return () => {
      cleanupListeners();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTouchDevice) return;
    //  cleanupListeners();
    startY.current = e.clientY;
    isDragging.current = true;

    document.addEventListener("mousemove", handleGlobalMouseMove, {
      capture: true,
    });
    document.addEventListener("mouseup", handleGlobalMouseUp, {
      capture: true,
    });
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isTouchDevice || !isDragging.current || !startY.current) return;

    const deltaY = startY.current - e.clientY;

    if (deltaY > threshold && onSwipeUp) {
      onSwipeUp();
      startY.current = e.clientY;
    }
  };

  const handleGlobalMouseUp = () => {
    cleanupListeners();
  };

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
  };

  return { handlers };
}
