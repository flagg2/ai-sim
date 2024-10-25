"use client";

import { ParamConfigurator } from "@repo/simulations/algos/paramConfigurators/param";
import { SliderParamConfigurator } from "@repo/simulations/algos/paramConfigurators/slider";
import { SwitchParamConfigurator } from "@repo/simulations/algos/paramConfigurators/switch";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Label } from "../../components/custom/Label";
import { Slider } from "../../components/shadcn/slider";
import { Switch } from "../../components/ui/switch";

type ParamConfiguratorProps<
  TParams extends Record<string, ParamConfigurator<any>>,
> = {
  params: TParams;
};

type ParamConfiguratorState<
  TParams extends Record<string, ParamConfigurator<any>>,
> = {
  [key in keyof TParams]: TParams[key]["defaultValue"];
};

export function useParamConfigurator<
  TParams extends Record<string, ParamConfigurator<any>>,
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

function Configurator<TParams extends Record<string, ParamConfigurator<any>>>({
  params,
  state,
  setState,
}: ParamConfiguratorProps<TParams> & {
  state: ParamConfiguratorState<TParams>;
  setState: Dispatch<SetStateAction<ParamConfiguratorState<TParams>>>;
}) {
  const getParamComponent = useCallback(
    (param: ParamConfigurator<any>, key: keyof TParams) => {
      if (param instanceof SliderParamConfigurator) {
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
      if (param instanceof SwitchParamConfigurator) {
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
