import { Button } from "../shadcn/button";
import {
  FaFastBackward,
  FaBackward,
  FaForward,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";
import { Step } from "@repo/simulations/algos/common";
import { Slider } from "../shadcn/slider";

type SimulationUIProps = {
  algorithmDescription: string;
  simulation: UseSimulationReturn<any, any>;
  canvasComponent: React.ReactNode;
  configComponent: React.ReactNode;
};

export default function SimulationUI({
  canvasComponent,
  ...props
}: SimulationUIProps) {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-68px)]">
      <main className="flex-1 grid grid-cols-[1fr_600px] gap-6 p-6 md:p-10">
        <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
          <div className="w-full h-full flex items-center justify-center">
            {canvasComponent}
          </div>
          {props.simulation.tooltip && (
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px]">
              <h3 className="text-xl font-bold mb-2">Hover Info</h3>
              {props.simulation.tooltip}
            </div>
          )}
        </div>
        <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
          <SimulationControls {...props} />
        </div>
      </main>
    </div>
  );
}

function SimulationControls({
  simulation: { runner, tooltip },
  configComponent,
  algorithmDescription,
}: {
  simulation: UseSimulationReturn<Step<any, any>, any>;
  configComponent: React.ReactNode;
  algorithmDescription: string;
}) {
  const { status } = runner;

  if (status === "configuring") {
    const { start } = runner;
    return (
      <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
        <div className="grid gap-2">
          <h3 className="text-xl font-bold">Configuration</h3>
          {configComponent}
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
    return <div>Loading...</div>;
  }

  const {
    forward,
    backward,
    reset,
    play,
    pause,
    stop,
    canGoForward,
    canGoBackward,
    currentStep,
    isPlaying,
    totalStepCount,
    currentStepIndex,
  } = runner;

  return (
    <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
      <div className="grid gap-2">
        <>
          <h3 className="text-xl font-bold">Simulation Controls</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              disabled={!canGoBackward}
            >
              <FaFastBackward className="h-5 w-5" />
              <span className="sr-only">Reset</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={backward}
              disabled={!canGoBackward}
            >
              <FaBackward className="h-5 w-5" />
              <span className="sr-only">Backward</span>
            </Button>
            {isPlaying ? (
              <Button variant="ghost" size="icon" onClick={pause}>
                <FaPause className="h-5 w-5" />
                <span className="sr-only">Pause</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={play}
                disabled={!canGoForward}
              >
                <FaPlay className="h-5 w-5" />
                <span className="sr-only">Play</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={forward}
              disabled={!canGoForward}
            >
              <FaForward className="h-5 w-5" />
              <span className="sr-only">Forward</span>
            </Button>
          </div>
          <Button
            onClick={() => {
              stop();
              reset();
            }}
          >
            Stop
          </Button>
        </>
      </div>
      <div className="grid gap-2">
        <>
          <h3 className="text-xl font-bold">
            Step {currentStep.index} of {totalStepCount}
          </h3>
          <Slider
            className="mb-4"
            // value={[currentStep.index]}
            min={0}
            max={totalStepCount - 1}
            value={[currentStepIndex]}
            onValueChange={(value) => {
              runner.goto(value[0]!);
            }}
          />
          <h2 className="text-lg font-bold">{currentStep.title}</h2>
          <div className="prose text-muted-foreground">
            {currentStep.description}
          </div>
        </>
      </div>
    </div>
  );
}
