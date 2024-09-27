import { Button } from "../shadcn/button";
import { FaBackward, FaForward, FaPlay, FaPause } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";
import { Step } from "@repo/simulations/algos/common";
import { Slider } from "../shadcn/slider";
import { Drawer, DrawerContent, DrawerTrigger } from "../shadcn/drawer";
import Loader from "./Loader";

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
    <div className="flex flex-col w-full  h-[calc(100vh-68px)]">
      {/* Mobile layout */}
      <div className="xl:hidden flex-1 relative">
        <div className="w-full h-full flex items-center justify-center">
          {canvasComponent}
        </div>
        {props.simulation.tooltip && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px] z-10">
            {props.simulation.tooltip}
          </div>
        )}
        <Drawer>
          <MobileControls {...props} canvasComponent={canvasComponent} />

          <DrawerContent className="h-full max-h-[80vh]">
            <div className="p-4 flex flex-col h-full">
              <SimulationControls {...props} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop layout */}
      <div className="hidden xl:flex flex-col w-full h-[65vh] xl:h-[calc(100vh-68px)]">
        <main className="flex-1 grid grid-cols-[1fr_600px] gap-6 p-6 md:p-10">
          <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center">
              {canvasComponent}
            </div>
            {props.simulation.tooltip && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px]">
                {props.simulation.tooltip}
              </div>
            )}
          </div>
          <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
            <SimulationControls {...props} />
          </div>
        </main>
      </div>
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
          <Button variant="outline">Configure</Button>
        </DrawerTrigger>
      </div>
    );
  }
  if (runner.status !== "running") {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
      <RunningButtons
        runner={runner}
        variant="outline"
        showReset={false}
        extraButtons={
          <DrawerTrigger asChild>
            <Button variant="outline">Show Step</Button>
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
          <h3 className="hidden xl:block text-xl font-bold">Configuration</h3>
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
            <RunningButtons runner={runner} />
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
                {currentStep.index} / {totalStepCount}
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

function RunningButtons({
  runner,
  variant = "ghost",
  extraButtons,
  showReset = true,
}: {
  runner: UseSimulationReturn<any, any>["runner"];
  variant?: "ghost" | "outline";
  extraButtons?: React.ReactNode;
  showReset?: boolean;
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
    stop,
    canGoBackward,
    canGoForward,
    isPlaying,
  } = runner;
  return (
    <div className="flex items-center gap-2 w-full">
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
      {showReset && (
        <Button
          className="ml-auto"
          variant={variant}
          size="icon"
          onClick={() => {
            stop();
            reset();
          }}
        >
          <VscSettings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      )}
    </div>
  );
}
