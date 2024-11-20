import { ControlsButtons } from "./buttons";
import { Loader } from "../../general/loader";
import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { Button, Slider } from "../../../shadcn";

export function BaseControls({
  simulation: { runner },
  configComponent,
  algorithmDescription,
  showConfig = true,
}: {
  simulation: UseSimulationReturn;
  configComponent: React.ReactNode;
  algorithmDescription: React.ReactNode;
  showConfig?: boolean;
}) {
  const { status } = runner;

  if (status === "configuring") {
    const { start } = runner;
    return (
      <div className="bg-background rounded-lg border p-6 flex flex-col-reverse xl:flex-col gap-6">
        <div className="grid gap-4">
          {showConfig && (
            <>
              <h3 className="hidden xl:block text-xl font-bold">
                Configuration
              </h3>
              {configComponent}
            </>
          )}
          <Button onClick={start}>Run</Button>
        </div>
        <div className="grid gap-2">
          <h3 className="text-xl font-bold">Algorithm Description</h3>
          <div className="prose text-muted-foreground">
            {algorithmDescription}
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
    <div className="bg-background rounded-lg border p-6 flex flex-col-reverse lg:flex-col gap-6 h-full">
      <div className="grid gap-2">
        <>
          <h3 className="hidden lg:block text-xl font-bold">
            Simulation Controls
          </h3>
          <div className="flex items-center gap-2">
            <ControlsButtons runner={runner} />
          </div>
        </>
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex flex-col-reverse lg:flex-col gap-2 flex-grow">
          <Slider
            className="lg:mb-4"
            // value={[currentStep.index]}
            min={0}
            max={totalStepCount - 1}
            value={[currentStepIndex]}
            onValueChange={(value) => {
              runner.goto(value[0]!);
            }}
          />
          <div className="flex flex-col gap-2 flex-grow">
            <div className="text-md font-bold flex justify-between">
              <span>{currentStep.title}</span>
              <span className="text-muted-foreground">
                {currentStepIndex + 1} / {totalStepCount}
              </span>
            </div>
            <div className="prose text-muted-foreground max-h-[44vh] xl:max-h-[60vh] overflow-scroll">
              {currentStep.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
