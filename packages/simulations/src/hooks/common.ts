export type UseSimulationReturn<T> = {
  state: T;
  stepDescription: React.ReactNode;
  forward: () => void;
  fastForward: () => void;
  backward: () => void;
  fastBackward: () => void;
};
