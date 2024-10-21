import { Param } from "./param";

type SliderParamProps = {
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  label: string;
  description?: string;
};

export class SliderParam extends Param<number> {
  public min: number;
  public max: number;
  public step: number;

  constructor(props: SliderParamProps) {
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
