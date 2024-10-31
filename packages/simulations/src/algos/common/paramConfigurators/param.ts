type ParamConfiguratorProps<TDefaultValue> = {
  label: string;
  description?: string;
  defaultValue: TDefaultValue;
};

export type ParamConfiguratorDict<T = Record<string, ParamConfigurator>> = {
  [K in keyof T]: T[K] extends ParamConfigurator ? T[K] : never;
};

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
