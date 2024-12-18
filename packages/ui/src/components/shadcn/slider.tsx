"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";
import { useIsTouchDevice } from "../../lib/hooks/use-is-touch-device";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    undraggable?: boolean;
    label?: string; // Add label prop
  }
>(({ className, undraggable = false, label, ...props }, ref) => {
  const { isTouchDevice } = useIsTouchDevice();

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      aria-label={label || "Slider"} // Add descriptive label
      {...props}
      {...(isTouchDevice && {
        onPointerDown: (event) => event.preventDefault(),
      })}
    >
      <SliderPrimitive.Track
        className="slider-track relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
        aria-label={`${label || "Slider"} track`}
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          undraggable && "pointer-events-none hidden",
        )}
        aria-label={`${label || "Slider"} thumb`}
        {...(isTouchDevice && {
          onPointerDown: (event) => event.stopPropagation(),
        })}
      />
    </SliderPrimitive.Root>
  );
});

export { Slider };
