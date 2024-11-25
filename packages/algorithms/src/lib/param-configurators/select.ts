import { ParamConfigurator } from "./param";

type SelectParamConfiguratorProps<TValue extends string> = {
  options: TValue[];
  label: string;
  description?: string;
  defaultValue: TValue;
};

export class SelectParamConfigurator<
  TValue extends string,
> extends ParamConfigurator<TValue> {
  public options: TValue[];

  constructor(props: SelectParamConfiguratorProps<TValue>) {
    super(props);
    this.options = props.options;
  }
}