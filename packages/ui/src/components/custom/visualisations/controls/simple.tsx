import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { Button } from "../../../shadcn/button";
import { DrawerTrigger } from "../../../shadcn/drawer";
import { Slider } from "../../../shadcn/slider";
import { ControlsButtons } from "./buttons";
import { AnimatePresence, motion } from "framer-motion";
import { IoExpand, IoPlay } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";

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
          <Button
            variant="default"
            className="flex-grow"
            onClick={runner.start}
          >
            Run
            <IoPlay className="h-5 w-5 ml-2" />
          </Button>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex-grow">
              Configure
              <VscSettings className="h-5 w-5 ml-2" />
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
            <ControlsButtons
              runner={runner}
              variant="outline"
              showReset={false}
              extraButtons={
                <DrawerTrigger asChild>
                  <Button
                    className="ml-auto flex items-center"
                    variant="outline"
                    size="default"
                  >
                    <span className="text-sm">Details</span>
                    <IoExpand className="h-5 w-5 ml-2" />
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
