import { FaForward, FaPlay } from "react-icons/fa";
import { FaBackward, FaPause } from "react-icons/fa";
import { Button } from "../../../shadcn/button";
import { VscSettings } from "react-icons/vsc";
import { UseSimulationReturn } from "../../../../lib/hooks/use-simulation";
import { useScreenSize } from "../../../../lib/hooks/use-screen-size";
import { breakpoints } from "../../../../lib/utils";

export function ControlsButtons({
  runner,
  extraButtons,
  showReset = true,
}: {
  runner: UseSimulationReturn["runner"];
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
  const screenSize = useScreenSize();
  const isDesktop = screenSize.width > breakpoints.desktop;

  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        variant={isDesktop ? "ghost" : "outline"}
        size="icon"
        onClick={backward}
        disabled={!canGoBackward}
      >
        <FaBackward className="h-5 w-5" />
        <span className="sr-only">Backward</span>
      </Button>
      {isPlaying ? (
        <Button
          variant={isDesktop ? "ghost" : "outline"}
          size="icon"
          onClick={pause}
        >
          <FaPause className="h-5 w-5" />
          <span className="sr-only">Pause</span>
        </Button>
      ) : (
        <Button
          variant={isDesktop ? "ghost" : "outline"}
          size="icon"
          onClick={play}
          disabled={!canGoForward}
        >
          <FaPlay className="h-5 w-5" />
          <span className="sr-only">Play</span>
        </Button>
      )}
      <Button
        variant={isDesktop ? "ghost" : "outline"}
        size="icon"
        onClick={forward}
        disabled={!canGoForward}
      >
        <FaForward className="h-5 w-5" />
        <span className="sr-only">Forward</span>
      </Button>
      {extraButtons}
      {showReset && (
        <>
          <Button
            className="ml-auto"
            variant={isDesktop ? "ghost" : "outline"}
            size="icon"
            onClick={() => {
              stop();
              reset();
            }}
          >
            <VscSettings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </>
      )}
    </div>
  );
}
