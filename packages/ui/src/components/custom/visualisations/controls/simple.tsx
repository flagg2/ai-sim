import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { DrawerIndicator, DrawerTrigger } from "../../../shadcn/drawer";
import { Slider } from "../../../shadcn/slider";
import { ControlsButtons } from "./buttons";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeGesture } from "../../../../lib/hooks/use-swipe-gesture";
import { useEffect } from "react";

export function SimpleControls({
  simulation: { runner },
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  simulation: UseSimulationReturn;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}) {
  const { handlers } = useSwipeGesture({
    onSwipeUp: () => setIsDrawerOpen(true),
  });

  if (runner.status === "configuring") {
    return (
      <div className="absolute -bottom-4 left-0 right-0">
        <motion.div
          className="flex flex-col gap-4 pb-8 bg-background/80 backdrop-blur-sm rounded-t-lg border p-4"
          {...handlers}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <DrawerIndicator />
          <DrawerTrigger asChild>
            <div className="flex flex-col items-center w-full justify-center font-bold">
              <div className="flex items-center">SWIPE UP TO START</div>
              <div className="text-sm text-muted-foreground mt-1">
                Swipe down anytime to see the visualization
              </div>
            </div>
          </DrawerTrigger>
        </motion.div>
      </div>
    );
  }

  if (runner.status !== "running") {
    return null;
  }

  const { currentStep, totalStepCount, currentStepIndex } = runner;

  return (
    <AnimatePresence>
      {!isDrawerOpen && (
        <motion.div
          {...handlers}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0"
        >
          <div className="-mb-1 flex flex-col gap-4 bg-background/80 backdrop-blur-sm rounded-t-lg border p-4 px-8">
            <DrawerIndicator />

            <div className="flex justify-between items-center">
              <span className="font-bold">{currentStep.title}</span>
              <span className="text-muted-foreground">
                {currentStepIndex + 1} / {totalStepCount}
              </span>
            </div>
            <Slider
              min={0}
              max={totalStepCount - 1}
              value={[currentStepIndex]}
              onValueChange={(value) => {
                runner.goto(value[0]!);
              }}
            />
            <ControlsButtons runner={runner} showReset={false} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
