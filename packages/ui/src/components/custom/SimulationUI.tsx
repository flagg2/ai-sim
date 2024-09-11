import { Button } from "../shadcn/button";
import {
  FaFastBackward,
  FaBackward,
  FaForward,
  FaFastForward,
} from "react-icons/fa";
import { UseSimulationReturn } from "@repo/simulations/hooks/common";

type SimulationUIProps<T> = {
  useSimulation: UseSimulationReturn<T>;
  running: boolean;
  onRun: () => void;
  onStop: () => void;
  canvasComponent: React.ReactNode;
  configComponent: React.ReactNode;
};

export default function SimulationUI<T>({
  useSimulation: {
    forward,
    fastForward,
    backward,
    fastBackward,
    stepDescription,
  },
  running,
  onRun,
  onStop,
  canvasComponent,
  configComponent,
}: SimulationUIProps<T>) {
  return (
    <div className="flex flex-col h-screen w-full">
      <main className="flex-1 grid grid-cols-[1fr_300px] gap-6 p-6 md:p-10">
        <div className="bg-muted rounded-lg overflow-hidden">
          <div className="w-full h-full">{canvasComponent}</div>
        </div>
        <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
          <div className="grid gap-2">
            {running ? (
              <>
                <h3 className="text-xl font-bold">Simulation Controls</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={fastBackward}>
                    <FaFastBackward className="h-5 w-5" />
                    <span className="sr-only">Fast Backward</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={backward}>
                    <FaBackward className="h-5 w-5" />
                    <span className="sr-only">Backward</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={forward}>
                    <FaForward className="h-5 w-5" />
                    <span className="sr-only">Forward</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={fastForward}>
                    <FaFastForward className="h-5 w-5" />
                    <span className="sr-only">Fast Forward</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={onRun}>Run</Button>
                <Button onClick={onStop}>Stop</Button>
                {configComponent}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">Step Description</h3>
            {/* TODO: setup tailwind typogtaphy if we decide to use it */}
            <div className="prose text-muted-foreground">{stepDescription}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
