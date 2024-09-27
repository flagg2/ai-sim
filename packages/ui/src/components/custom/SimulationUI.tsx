import { Button } from "../shadcn/button";
import {
  FaFastBackward,
  FaBackward,
  FaForward,
  FaPlay,
  FaPause,
  FaBars,
} from "react-icons/fa";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";
import { Step } from "@repo/simulations/algos/common";
import { Slider } from "../shadcn/slider";
import { Drawer, DrawerContent, DrawerTrigger } from "../shadcn/drawer";
import { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-68px)]">
        <div className="flex-1 relative">
          <div className="w-full h-full flex items-center justify-center">
            {canvasComponent}
          </div>
          <Drawer>
            <MobileControls {...props} canvasComponent={canvasComponent} />

            <DrawerContent>
              <div className="p-4">
                <SimulationControls {...props} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    );
  }

  // Desktop layout remains unchanged
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

function MobileControls({ simulation: { runner } }: SimulationUIProps) {
  if (runner.status === "configuring") {
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button variant="outline" onClick={runner.start}>
          Start
        </Button>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <FaBars className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
      </div>
    );
  }
  if (runner.status !== "running") {
    return null;
  }
  const { forward, backward, canGoForward, canGoBackward } = runner;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
      <RunningButtons
        runner={runner}
        variant="outline"
        extraButtons={
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <FaBars className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
        }
      />
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
            <RunningButtons runner={runner} />
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

function RunningButtons({
  runner,
  variant = "ghost",
  extraButtons,
}: {
  runner: UseSimulationReturn<any, any>["runner"];
  variant?: "ghost" | "outline";
  extraButtons?: React.ReactNode;
}) {
  if (runner.status !== "running") {
    return null;
  }
  const {
    reset,
    backward,
    forward,
    pause,
    play,
    canGoBackward,
    canGoForward,
    isPlaying,
  } = runner;
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size="icon"
        onClick={reset}
        disabled={!canGoBackward}
      >
        <FaFastBackward className="h-5 w-5" />
        <span className="sr-only">Reset</span>
      </Button>
      <Button
        variant={variant}
        size="icon"
        onClick={backward}
        disabled={!canGoBackward}
      >
        <FaBackward className="h-5 w-5" />
        <span className="sr-only">Backward</span>
      </Button>
      {isPlaying ? (
        <Button variant={variant} size="icon" onClick={pause}>
          <FaPause className="h-5 w-5" />
          <span className="sr-only">Pause</span>
        </Button>
      ) : (
        <Button
          variant={variant}
          size="icon"
          onClick={play}
          disabled={!canGoForward}
        >
          <FaPlay className="h-5 w-5" />
          <span className="sr-only">Play</span>
        </Button>
      )}
      <Button
        variant={variant}
        size="icon"
        onClick={forward}
        disabled={!canGoForward}
      >
        <FaForward className="h-5 w-5" />
        <span className="sr-only">Forward</span>
      </Button>
      {extraButtons}
    </div>
  );
}
