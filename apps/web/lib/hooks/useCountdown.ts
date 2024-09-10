import { useState, useEffect, useRef, useCallback } from "react";

const useCountdown = (defaultValue: number) => {
  const [value, setValue] = useState<number>(0);
  const countdownRef = useRef<any | null>(null);

  const start = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setValue(defaultValue);

    countdownRef.current = setInterval(() => {
      setValue((prevValue) => {
        if (prevValue > 1) {
          return prevValue - 1;
        } else {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return 0;
        }
      });
    }, 1000);
  }, [defaultValue]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return [value, start] as const;
};

export default useCountdown;
