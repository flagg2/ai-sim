import { Param } from "./param";

type SwitchParamProps = {
  defaultValue: boolean;
  label: string;
  description?: string;
};

export class SwitchParam extends Param<boolean> {
  constructor(props: SwitchParamProps) {
    super({
      label: props.label,
      description: props.description,
      defaultValue: props.defaultValue,
    });
  }
}
