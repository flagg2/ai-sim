declare module "ml-regression" {
  export class PolynomialRegression {
    constructor(x: number[], y: number[], degree: number);
    predict(x: number): number;
    toString(): string;
    // Add other methods and properties as needed
  }
}
