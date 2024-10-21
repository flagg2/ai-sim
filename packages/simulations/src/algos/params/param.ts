type ParamProps<TDefaultValue> = {
  label: string;
  description?: string;
  defaultValue: TDefaultValue;
};

export class Param<TDefaultValue> {
  public label: string;
  public description?: string;
  public defaultValue: TDefaultValue;

  constructor(props: ParamProps<TDefaultValue>) {
    this.label = props.label;
    this.description = props.description;
    this.defaultValue = props.defaultValue;
  }
}
