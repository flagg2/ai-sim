import { useState, useEffect, useRef, useCallback } from "react";
import type { ThreeEvent } from "@react-three/fiber";

export function useTooltip() {
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
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
          onPointerOut: (e: ThreeEvent<PointerEvent>) => {
            setTooltip(null);
          },
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setTooltip(tooltipContent);
          },
        };
      }
    },
    [isMobile],
  );

  return { tooltip, tooltipHandlers };
}
