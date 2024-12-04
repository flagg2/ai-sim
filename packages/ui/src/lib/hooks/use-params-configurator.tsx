"use client";

import { useState } from "react";
import { ParamConfiguratorDict } from "@repo/algorithms/lib";
import {
  Configurator,
  ParamConfiguratorState,
} from "../../components/custom/visualisations/configurator";
import { useDebounce } from "./use-debounce";

export function useParamsConfigurator<T extends ParamConfiguratorDict>(
  configurators: T,
) {
  const [params, setParams] = useState<ParamConfiguratorState<T>>(
    Object.fromEntries(
      Object.entries(configurators).map(([key, param]) => [
        key,
        param.defaultValue,
      ]),
    ) as ParamConfiguratorState<T>,
  );

  const [debouncedParams, setDebouncedParams] = useState(params);

  const debouncedSetParams = useDebounce(
    (newParams: ParamConfiguratorState<T>) => {
      setDebouncedParams(newParams);
    },
    100,
  );

  return {
    params: debouncedParams,
    ParamsConfigurator: (
      <Configurator
        configurators={configurators}
        params={params}
        setParams={(newParams) => {
          setParams(newParams);
          debouncedSetParams(newParams);
        }}
      />
    ),
  };
}
