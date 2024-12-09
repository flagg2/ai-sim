import { ControlsButtons } from "./buttons";
import { Loader } from "../../general/loader";
import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { Button, Slider } from "../../../shadcn";
import { IoPlay } from "react-icons/io5";
import { useShowHints } from "../../../../lib/hooks/use-show-hints";
import { cn } from "../../../../lib/utils";

export function BaseControls({
  title,
  simulation: { runner },
  configComponent,
  algorithmDescription,
  showConfig = true,
  setIsDrawerOpen,
}: {
  title: string;
  simulation: UseSimulationReturn;
  configComponent: React.ReactNode;
  algorithmDescription: React.ReactNode;
  showConfig?: boolean;
  setIsDrawerOpen?: (open: boolean) => void;
}) {
  const { status, sliderStepIndex } = runner;
  const { shouldShowHints } = useShowHints();

  if (status === "configuring") {
    const { start } = runner;
    return (
      <div
        className={cn(
          "bg-background h-full rounded-lg border p-4 flex flex-col gap-6 relative",
          shouldShowHints() && "h-[calc(100%-28px)]",
        )}
      >
        <div className="grid gap-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="prose text-muted-foreground">
            {algorithmDescription}
          </div>
        </div>

        <div className="grid gap-4 overflow-auto max-h-[calc(100vh-200px)]">
          {showConfig && configComponent}
          <div className="bg-background pt-2 absolute bottom-4 left-4 right-4 flex gap-2">
            <Button
              onClick={() => {
                console.log("setIsDrawerOpen", setIsDrawerOpen);
                start();
              }}
              className="flex-grow"
              variant="default"
            >
              Run
              <IoPlay className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="bg-background flex items-center justify-center flex-grow">
        <Loader />
      </div>
    );
  }

  const { currentStep, currentStepIndex, totalStepCount, gotoWithSlider } =
    runner;

  return (
    <div
      className={cn(
        "h-full bg-background rounded-lg border xl:border-none p-4 xl:p-0 flex flex-col-reverse lg:flex-col gap-6",
        shouldShowHints() && "h-[calc(100%-28px)]",
      )}
    >
      <div className="flex flex-col min-h-0 h-full">
        <div className="xl:border rounded-lg contents xl:flex flex-col gap-2 xl:p-4 flex-shrink-0 mb-2">
          <div className="text-md font-bold flex justify-between mb-2 order-1 lg:order-1 shrink-0">
            <span>{currentStep.title}</span>
            <span className="text-muted-foreground">
              {currentStepIndex + 1} / {totalStepCount}
            </span>
          </div>
          <div className="grid gap-2 mt-4 lg:mt-2 order-3 lg:order-2 shrink-0">
            <Slider
              className="mb-2"
              min={0}
              max={totalStepCount - 1}
              value={[sliderStepIndex]}
              onValueChange={(value) => gotoWithSlider(value[0]!)}
            />
            <div className="flex items-center gap-2 xl:hidden">
              <ControlsButtons runner={runner} />
            </div>
            <div className="items-center gap-2 hidden xl:flex">
              <ControlsButtons runner={runner} />
            </div>
          </div>
        </div>
        <div className="prose text-muted-foreground order-2 lg:order-3 xl:p-4 xl:border rounded-lg min-h-0 flex-grow overflow-scroll">
          {currentStep.description}
        </div>
      </div>
    </div>
  );
}
