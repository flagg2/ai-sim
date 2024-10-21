"use client";

import { Param } from "@repo/simulations/algos/params/param";
import { SliderParam } from "@repo/simulations/algos/params/slider";
import { SwitchParam } from "@repo/simulations/algos/params/switch";
import { useCallback, useState } from "react";
import { Label } from "./Label";
import { Slider } from "../shadcn/slider";
import { Switch } from "../ui/switch";

type ParamConfiguratorProps<TParam extends Param<any>> = {
  params: {
    [key: string]: TParam;
  };
};

type ParamConfiguratorState<TParam extends Param<any>> = {
  [key: string]: TParam["defaultValue"];
};

export function ParamConfigurator<TParam extends Param<any>>({
  params,
}: ParamConfiguratorProps<TParam>) {
  const [state, setState] = useState<ParamConfiguratorState<TParam>>(
    Object.fromEntries(
      Object.entries(params).map(([key, param]) => [key, param.defaultValue]),
    ),
  );

  const getParamComponent = useCallback(
    (param: TParam, key: string) => {
      if (param instanceof SliderParam) {
        return (
          <Slider
            value={[state[key]!]}
            onValueChange={(value) => setState({ ...state, [key]: value[0]! })}
            min={param.min}
            max={param.max}
            step={param.step}
          />
        );
      }
      if (param instanceof SwitchParam) {
        return (
          <Switch
            checked={state[key]!}
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
