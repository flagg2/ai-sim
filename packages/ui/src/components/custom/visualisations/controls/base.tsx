import { ControlsButtons } from "./buttons";
import { Loader } from "../../general/loader";
import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { Button, Slider } from "../../../shadcn";
import { IoPlay } from "react-icons/io5";

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
  const { status } = runner;

  if (status === "configuring") {
    const { start } = runner;
    return (
      <div className="bg-background h-full rounded-lg border p-6 flex flex-col gap-6 relative">
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
      <div className="bg-background flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  const { currentStep, totalStepCount, currentStepIndex } = runner;

  return (
    <div className="bg-background rounded-lg border p-4 flex flex-col-reverse lg:flex-col gap-6 h-full">
      <div className="flex-grow flex flex-col">
        <div className="flex flex-col gap-2 flex-grow">
          <div className="text-md font-bold flex justify-between mb-4">
            <span>{currentStep.title}</span>
            <span className="text-muted-foreground">
              {currentStepIndex + 1} / {totalStepCount}
            </span>
          </div>
          <Slider
            className="mb-2"
            min={0}
            max={totalStepCount - 1}
            value={[currentStepIndex]}
            onValueChange={(value) => {
              runner.goto(value[0]!);
            }}
          />
          <div className="grid gap-2">
            <>
              <div className="flex items-center gap-2 xl:hidden">
                <ControlsButtons runner={runner} />
              </div>
              <div className="items-center gap-2 hidden xl:flex">
                <ControlsButtons runner={runner} />
              </div>
            </>
          </div>
          <div className="prose text-muted-foreground max-h-[44vh] xl:max-h-[60vh] overflow-scroll">
            {currentStep.description}
          </div>
        </div>
      </div>
    </div>
  );
}
