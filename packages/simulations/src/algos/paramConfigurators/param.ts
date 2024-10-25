type ParamConfiguratorProps<TDefaultValue> = {
  label: string;
  description?: string;
  defaultValue: TDefaultValue;
};

export class ParamConfigurator<TDefaultValue> {
  public label: string;
  public description?: string;
  public defaultValue: TDefaultValue;

  constructor(props: ParamConfiguratorProps<TDefaultValue>) {
    this.label = props.label;
    this.description = props.description;
    this.defaultValue = props.defaultValue;
  }
}
