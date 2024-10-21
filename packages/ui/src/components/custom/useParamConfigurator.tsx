"use client";

import { Param } from "@repo/simulations/algos/params/param";
import { SliderParam } from "@repo/simulations/algos/params/slider";
import { SwitchParam } from "@repo/simulations/algos/params/switch";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Label } from "../../components/custom/Label";
import { Slider } from "../../components/shadcn/slider";
import { Switch } from "../../components/ui/switch";

type ParamConfiguratorProps<TParams extends Record<string, Param<any>>> = {
  params: TParams;
};

type ParamConfiguratorState<TParams extends Record<string, Param<any>>> = {
  [key in keyof TParams]: TParams[key]["defaultValue"];
};

export function useParamConfigurator<
  TParams extends Record<string, Param<any>>,
>(params: ParamConfiguratorProps<TParams>["params"]) {
  const [state, setState] = useState<ParamConfiguratorState<TParams>>(
    Object.fromEntries(
      Object.entries(params).map(([key, param]) => [key, param.defaultValue]),
    ) as ParamConfiguratorState<TParams>,
  );

  return {
    state,
    Configurator: (
      <Configurator params={params} state={state} setState={setState} />
    ),
  };
}

function Configurator<TParams extends Record<string, Param<any>>>({
  params,
  state,
  setState,
}: ParamConfiguratorProps<TParams> & {
  state: ParamConfiguratorState<TParams>;
  setState: Dispatch<SetStateAction<ParamConfiguratorState<TParams>>>;
}) {
  const getParamComponent = useCallback(
    (param: Param<any>, key: keyof TParams) => {
      if (param instanceof SliderParam) {
        return (
          <>
            <Slider
              value={[state[key]!]}
              onValueChange={(value) =>
                setState({ ...state, [key]: value[0]! })
              }
              min={param.min}
              max={param.max}
              step={param.step}
            />
          </>
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
        <Label key={key} label={param.label} info={param.description}>
          {getParamComponent(param, key)}
          <div className="text-xs text-darkish-text">{state[key]}</div>
        </Label>
      ))}
    </div>
  );
}
