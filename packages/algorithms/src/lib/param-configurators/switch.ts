import { ParamConfigurator } from "./param";

type SwitchParamConfiguratorProps = {
  defaultValue: boolean;
  label: string;
  description?: string;
};

/**
 * A configurable parameter in an algorithm that allows the user to toggle a boolean value.
 */
export class SwitchParamConfigurator extends ParamConfigurator<boolean> {
  constructor(props: SwitchParamConfiguratorProps) {
    super({
      label: props.label,
      description: props.description,
      defaultValue: props.defaultValue,
    });
  }
}
