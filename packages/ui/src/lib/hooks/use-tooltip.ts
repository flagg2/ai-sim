import { useState, useEffect, useRef, useCallback } from "react";
import type { ThreeEvent } from "@react-three/fiber";

const MOBILE_WIDTH = 768;

export function useTooltip() {
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipTimeoutRef = useRef<Timer | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= MOBILE_WIDTH);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const tooltipHandlers = useCallback(
    (tooltipContent: React.ReactNode) => {
      if (isMobile) {
        return {
          onPointerDown: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            if (tooltipTimeoutRef.current) {
              clearTimeout(tooltipTimeoutRef.current);
            }
            setTooltip((prevTooltip) => {
              if (prevTooltip === tooltipContent) {
                return null;
              } else {
                tooltipTimeoutRef.current = setTimeout(() => {
                  setTooltip(null);
                }, 3000);
                return tooltipContent;
              }
            });
          },
        };
      } else {
        return {
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            if (tooltipTimeoutRef.current) {
              clearTimeout(tooltipTimeoutRef.current);
            }
            setTooltip(tooltipContent);
            tooltipTimeoutRef.current = setTimeout(() => {
              setTooltip(null);
            }, 3000);
          },
          onPointerOut: () => {
            setTooltip(null);
          },
        };
      }
    },
    [isMobile],
  );

  return { tooltip, tooltipHandlers };
}
