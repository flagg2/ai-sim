import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useDebounce(() => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight });
  }, 300);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return screenSize;
}
