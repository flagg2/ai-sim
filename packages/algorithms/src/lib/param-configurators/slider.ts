import { ParamConfigurator } from "./param";

type SliderParamConfiguratorProps = {
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  label: string;
  description?: string;
};

export class SliderParamConfigurator extends ParamConfigurator<number> {
  public min: number;
  public max: number;
  public step: number;

  constructor(props: SliderParamConfiguratorProps) {
    super({
      label: props.label,
      description: props.description,
      defaultValue: props.defaultValue,
    });
    this.min = props.min;
    this.max = props.max;
    this.step = props.step ?? 1;
  }
}
