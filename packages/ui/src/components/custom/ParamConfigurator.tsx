"use client";

import { useCallback, useState } from "react";
import { Label } from "./Label";
import { Slider } from "../shadcn/slider";
import { Switch } from "../ui/switch";
import {
  ParamConfigurator,
  ParamConfiguratorDict,
} from "@repo/simulations/algos/paramConfigurators/param";
import { SliderParamConfigurator } from "@repo/simulations/algos/paramConfigurators/slider";
import { SwitchParamConfigurator } from "@repo/simulations/algos/paramConfigurators/switch";

type ParamConfiguratorProps<TParams extends ParamConfiguratorDict> = {
  params: TParams;
};

type ParamConfiguratorState<TParams extends ParamConfiguratorDict> = {
  [key: string]: TParams[keyof TParams]["defaultValue"];
};

export function ParamConfiguratorComponent<
  TParams extends ParamConfiguratorDict,
>({ params }: ParamConfiguratorProps<TParams>) {
  const [state, setState] = useState<ParamConfiguratorState<TParams>>(
    Object.fromEntries(
      Object.entries(params).map(([key, param]) => [key, param.defaultValue]),
    ),
  );

  const getParamComponent = useCallback(
    (param: ParamConfigurator<any>, key: string) => {
      if (param instanceof SliderParamConfigurator) {
        return (
          <Slider
            value={[state[key] as number]}
            onValueChange={(value) => setState({ ...state, [key]: value[0]! })}
            min={param.min}
            max={param.max}
            step={param.step}
          />
        );
      }
      if (param instanceof SwitchParamConfigurator) {
        return (
          <Switch
            checked={state[key] as boolean}
            onCheckedChange={(checked) =>
              setState({ ...state, [key]: checked })
            }
          />
        );
      }

      return null;
    },
    [state],
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {Object.entries(params).map(([key, param]) => (
        <Label label={param.label} info={param.description}>
          {getParamComponent(param, key)}
        </Label>
      ))}
    </div>
  );
}
