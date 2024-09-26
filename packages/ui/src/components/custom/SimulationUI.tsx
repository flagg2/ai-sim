import { Button } from "../shadcn/button";
import {
  FaFastBackward,
  FaBackward,
  FaForward,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";

type SimulationUIProps = {
  algorithmDescription: string;
  simulation: UseSimulationReturn<any>;
  started: boolean;
  onStart: () => void;
  onStop: () => void;
  canvasComponent: React.ReactNode;
  configComponent: React.ReactNode;
};

export default function SimulationUI({
  algorithmDescription,
  simulation: {
    runner: {
      forward,
      backward,
      reset,
      play,
      pause,
      isPlaying,
      canGoForward,
      canGoBackward,
      lastStep,
      steps,
    },
    tooltip,
    totalSteps,
  },
  started,
  onStart,
  onStop,
  canvasComponent,
  configComponent,
}: SimulationUIProps) {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-68px)]">
      <main className="flex-1 grid grid-cols-[1fr_600px] gap-6 p-6 md:p-10">
        <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            {canvasComponent}
          </div>
        </div>
        <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
          <div className="grid gap-2">
            {started ? (
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
                    onStop();
                    reset();
                  }}
                >
                  Stop
                </Button>
              </>
            ) : (
              <div className="flex flex-col  gap-2">
                <h3 className="text-xl font-bold">Configuration</h3>
                {configComponent}
                <Button onClick={onStart}>Run</Button>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            {started ? (
              <>
                {!totalSteps.isPending && (
                  <h3 className="text-xl font-bold">
                    Step {steps.length} of {totalSteps.stepCount}
                  </h3>
                )}
                <h2 className="text-lg font-bold">{lastStep?.title}</h2>
                <div className="prose text-muted-foreground">
                  {lastStep?.description}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Algorithm Description</h3>
                <div className="prose text-muted-foreground">
                  {algorithmDescription}
                </div>
              </div>
            )}
          </div>
          <div className="">
            {tooltip && (
              <>
                <h3 className="text-xl font-bold">Hover Info</h3>
                {tooltip}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
