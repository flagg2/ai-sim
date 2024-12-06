"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";
import { useIsTouchDevice } from "../../../lib/hooks/use-is-touch-device";

type LabelProps = {
  label: string;
  info?: string;
  required?: boolean;
  children?: React.ReactNode;
};

export function Label({ label, info, required, children }: LabelProps) {
  const { isTouchDevice } = useIsTouchDevice();
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <label className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 items-center">
        <div className="text-sm text-darkish-text">
          {label}
          {required ? "*" : ""}
        </div>
        {info !== undefined && (
          <TooltipProvider>
            <Tooltip delayDuration={isTouchDevice ? 0 : 200} open={open}>
              <div ref={tooltipRef} className="flex flex-row items-center">
                <TooltipTrigger
                  type="button"
                  onMouseEnter={() => {
                    if (!isTouchDevice) {
                      setOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isTouchDevice) {
                      setOpen(false);
                    }
                  }}
                  onClick={() => {
                    if (isTouchDevice) {
                      setOpen(!open);
                    }
                  }}
                >
                  <FaInfoCircle
                    className="text-light-text cursor-pointer"
                    size={16}
                    role="button"
                    aria-label={`Info for ${label}`}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="max-w-[150px] md:max-w-[300px] relative z-[3] text-sm md:text-xs"
                  sideOffset={5}
                >
                  <p>{info}</p>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </label>
  );
}
