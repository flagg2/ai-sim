"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Label } from "./label";
import { Slider } from "../shadcn/slider";
import { Switch } from "../shadcn/switch";
import { ParamConfiguratorDict } from "@repo/simulations/lib/types";
import { ParamConfigurator } from "@repo/simulations/lib/param-configurators/param";
import { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import { SwitchParamConfigurator } from "@repo/simulations/lib/param-configurators/switch";

type ParamConfiguratorProps<T extends ParamConfiguratorDict> = {
  configurators: T;
};

type ParamConfiguratorState<T extends ParamConfiguratorDict> = {
  [key in keyof T]: T[key]["defaultValue"];
};

export function useParamConfigurator<T extends ParamConfiguratorDict>(
  configurators: T,
) {
  const [params, setState] = useState<ParamConfiguratorState<T>>(
    Object.fromEntries(
      Object.entries(configurators).map(([key, param]) => [
        key,
        param.defaultValue,
      ]),
    ) as ParamConfiguratorState<T>,
  );

  return {
    params,
    Configurator: (
      <Configurator
        configurators={configurators}
        params={params}
        setParams={setState}
      />
    ),
  };
}

function Configurator<T extends ParamConfiguratorDict>({
  configurators,
  params,
  setParams,
}: ParamConfiguratorProps<T> & {
  params: ParamConfiguratorState<T>;
  setParams: Dispatch<SetStateAction<ParamConfiguratorState<T>>>;
}) {
  const getParamComponent = useCallback(
    (param: ParamConfigurator, key: keyof T) => {
      if (param instanceof SliderParamConfigurator) {
        const value = params[key]! as number;
        return (
          <>
            <Slider
              value={[value]}
              onValueChange={(value) =>
                setParams({ ...params, [key]: value[0]! })
              }
              min={param.min}
              max={param.max}
              step={param.step}
            />
          </>
        );
      }
      if (param instanceof SwitchParamConfigurator) {
        const value = params[key]! as boolean;
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) =>
              setParams({ ...params, [key]: checked })
            }
          />
        );
      }

      return null;
    },
    [params],
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {Object.entries(configurators).map(([key, param]) => (
        <Label key={key} label={param.label} info={param.description}>
          {getParamComponent(param, key)}
          <div className="text-xs text-darkish-text">
            {/* TODO: better typing to avoid these casts */}
            {params[key] as string}
          </div>
        </Label>
      ))}
    </div>
  );
}
