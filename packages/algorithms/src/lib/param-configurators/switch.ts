import { ParamConfigurator } from "./param";

type SwitchParamConfiguratorProps = {
  defaultValue: boolean;
  label: string;
  description?: string;
};

export class SwitchParamConfigurator extends ParamConfigurator<boolean> {
  constructor(props: SwitchParamConfiguratorProps) {
    super({
      label: props.label,
      description: props.description,
      defaultValue: props.defaultValue,
    });
  }
}
