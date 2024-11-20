"use client";

import { useState } from "react";
import { ParamConfiguratorDict } from "@repo/algorithms/lib";
import {
  Configurator,
  ParamConfiguratorState,
} from "../../components/custom/visualisations/configurator";

export function useParamsConfigurator<T extends ParamConfiguratorDict>(
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
    ParamsConfigurator: (
      <Configurator
        configurators={configurators}
        params={params}
        setParams={setState}
      />
    ),
  };
}
