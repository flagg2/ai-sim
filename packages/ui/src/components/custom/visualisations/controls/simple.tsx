import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { Button } from "../../../shadcn/button";
import { DrawerTrigger } from "../../../shadcn/drawer";
import { Slider } from "../../../shadcn/slider";
import { RunningButtons } from "../running-buttons";
import { AnimatePresence, motion } from "framer-motion";
import { IoInformationCircleOutline } from "react-icons/io5";

export function SimpleControls({
  simulation: { runner },
  isDrawerOpen,
}: {
  isDrawerOpen: boolean;
  simulation: UseSimulationReturn;
}) {
  if (runner.status === "configuring") {
    return (
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex gap-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4">
          <Button className="flex-grow" onClick={runner.start}>
            Start
          </Button>
          <DrawerTrigger asChild>
            <Button className="flex-grow" variant="outline">
              Configure
            </Button>
          </DrawerTrigger>
        </div>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-0 right-0 px-4"
        >
          <div className="flex flex-col gap-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4">
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
            <RunningButtons
              runner={runner}
              variant="outline"
              showReset={false}
              extraButtons={
                <DrawerTrigger asChild>
                  <Button className="ml-auto" variant="outline" size="icon">
                    <IoInformationCircleOutline className="h-5 w-5" />
                    <span className="sr-only">Show Step Details</span>
                  </Button>
                </DrawerTrigger>
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
