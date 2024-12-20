import { ParamConfigurator } from "./param";

type SliderParamConfiguratorProps = {
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  label: string;
  description?: string;
};

/**
 * A configurable parameter in an algorithm that allows the user to select a value from a range of numbers.
 */
export class SliderParamConfigurator extends ParamConfigurator<number> {
  public min: number;
  public max: number;
  public step: number;

  constructor(props: SliderParamConfiguratorProps) {
    super(props);
    this.min = props.min;
    this.max = props.max;
    this.step = props.step ?? 1;
  }
}
