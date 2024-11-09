import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/tooltip";

type LabelProps = {
  label: string;
  info?: string;
  required?: boolean;
  children?: React.ReactNode;
};

export function Label({ label, info, required, children }: LabelProps) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 items-center">
        <div className="text-xs text-darkish-text">
          {label}
          {required ? "*" : ""}
        </div>
        {info !== undefined && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger type="button">
                <FaInfoCircle className="text-light-text" size={14} />
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="max-w-[300px] relative z-[3]"
              >
                <p>{info}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </label>
  );
}
