type ParamConfiguratorProps<TDefaultValue> = {
  label: string;
  description?: string;
  defaultValue: TDefaultValue;
};

/**
 * A genericconfigurable parameter in an algorithm.
 */
export class ParamConfigurator<TDefaultValue = unknown> {
  public label: string;
  public description?: string;
  public defaultValue: TDefaultValue;

  constructor(props: ParamConfiguratorProps<TDefaultValue>) {
    this.label = props.label;
    this.description = props.description;
    this.defaultValue = props.defaultValue;
  }
}
