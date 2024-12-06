"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: 2000,
    height: 2000,
  });

  const handleResize = useDebounce(() => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight });
  }, 300);

  useEffect(() => {
    setScreenSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return screenSize;
}
