"use client";

import { Dispatch, SetStateAction, useCallback } from "react";
import { Slider } from "../../shadcn/slider";
import { Switch } from "../../shadcn/switch";
import {
  ParamConfigurator,
  ParamConfiguratorDict,
  SelectParamConfigurator,
  SliderParamConfigurator,
  SwitchParamConfigurator,
} from "@repo/algorithms/lib";
import { Label } from "../general/label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "../../shadcn/select";

export type ParamConfiguratorProps<T extends ParamConfiguratorDict> = {
  configurators: T;
};

export type ParamConfiguratorState<T extends ParamConfiguratorDict> = {
  [key in keyof T]: T[key]["defaultValue"];
};

export function Configurator<T extends ParamConfiguratorDict>({
  configurators,
  params,
  setParams,
}: ParamConfiguratorProps<T> & {
  params: ParamConfiguratorState<T>;
  setParams: (newParams: ParamConfiguratorState<T>) => void;
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
            <div className="text-xs text-darkish-text">
              {params[key] as string}
            </div>
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
      if (param instanceof SelectParamConfigurator) {
        const value = params[key]! as string;
        return (
          <Select
            value={value}
            onValueChange={(value: string) =>
              setParams({ ...params, [key]: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {param.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        </Label>
      ))}
    </div>
  );
}
