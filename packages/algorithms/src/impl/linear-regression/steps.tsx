import type { Coords3D } from "../../lib";
import type { LinearRegressionDefinition } from "./types";

export const getLinearRegressionSteps: LinearRegressionDefinition["getSteps"] =
  async (config, initialStep) => {
    const steps = [initialStep];
    const { points } = config;

    // Calculate means
    const means = {
      x: points.reduce((sum, point) => sum + point.coords.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.coords.y, 0) / points.length,
      z: points.reduce((sum, point) => sum + point.coords.z, 0) / points.length,
    };

    steps.push({
      type: "calculateMeans",
      title: "Calculate Means",
      state: {
        means,
      },
      description: (
        <div>
          <p>
            Start by calculating the mean values for x, y, and z for the data.
          </p>
        </div>
      ),
    });

    // Calculate coefficients (slope and intercept)
    const numeratorXY = points.reduce(
      (sum, point) =>
        sum + (point.coords.x - means.x) * (point.coords.y - means.y),
      0,
    );

    const numeratorXZ = points.reduce(
      (sum, point) =>
        sum + (point.coords.x - means.x) * (point.coords.z - means.z),
      0,
    );

    const denominatorX = points.reduce(
      (sum, point) => sum + Math.pow(point.coords.x - means.x, 2),
      0,
    );

    const coefficients = {
      slopeXY: numeratorXY / denominatorX,
      slopeXZ: numeratorXZ / denominatorX,
      interceptY: means.y - (numeratorXY / denominatorX) * means.x,
      interceptZ: means.z - (numeratorXZ / denominatorX) * means.x,
    };

    steps.push({
      type: "calculateCoefficients",
      title: "Calculate Coefficients",
      state: {
        means,
        coefficients,
      },
      description: (
        <div>
          <p>Calculate the regression line coefficients:</p>
          <ul>
            <li>Slope X-Y: {coefficients.slopeXY.toFixed(4)}</li>
            <li>Slope X-Z: {coefficients.slopeXZ.toFixed(4)}</li>
            <li>Intercept Y: {coefficients.interceptY.toFixed(4)}</li>
            <li>Intercept Z: {coefficients.interceptZ.toFixed(4)}</li>
          </ul>
          <p>
            The equations of the plane are:
            <br />y = {coefficients.slopeXY.toFixed(2)}x +{" "}
            {coefficients.interceptY.toFixed(2)}
            <br />z = {coefficients.slopeXZ.toFixed(2)}x +{" "}
            {coefficients.interceptZ.toFixed(2)}
          </p>
        </div>
      ),
    });

    // Create prediction line points
    const minX = Math.min(...points.map((p) => p.coords.x));
    const maxX = Math.max(...points.map((p) => p.coords.x));

    const predictionLine = {
      start: {
        x: minX,
        y: coefficients.slopeXY * minX + coefficients.interceptY,
        z: coefficients.slopeXZ * minX + coefficients.interceptZ,
      } as Coords3D,
      end: {
        x: maxX,
        y: coefficients.slopeXY * maxX + coefficients.interceptY,
        z: coefficients.slopeXZ * maxX + coefficients.interceptZ,
      } as Coords3D,
    };

    steps.push({
      type: "updateLine",
      title: "Update Regression Line",
      state: {
        means,
        coefficients,
        predictionLine,
      },
      description: (
        <div>
          <p>Draw the regression line using the calculated coefficients:</p>
          <ul>
            <li>
              Starting point: ({predictionLine.start.x.toFixed(2)},{" "}
              {(
                coefficients.slopeXY * predictionLine.start.x +
                coefficients.interceptY
              ).toFixed(2)}
              ,{" "}
              {(
                coefficients.slopeXZ * predictionLine.start.x +
                coefficients.interceptZ
              ).toFixed(2)}
              )
            </li>
            <li>
              Ending point: ({predictionLine.end.x.toFixed(2)},{" "}
              {(
                coefficients.slopeXY * predictionLine.end.x +
                coefficients.interceptY
              ).toFixed(2)}
              ,{" "}
              {(
                coefficients.slopeXZ * predictionLine.end.x +
                coefficients.interceptZ
              ).toFixed(2)}
              )
            </li>
          </ul>
        </div>
      ),
    });

    // we can calculate how good the line is by calculating the sum of squared errors

    const sumOfSquaredErrors = points.reduce((sum, point) => {
      const predictedY =
        coefficients.slopeXY * point.coords.x + coefficients.interceptY;
      const predictedZ =
        coefficients.slopeXZ * point.coords.x + coefficients.interceptZ;
      return (
        sum +
        Math.pow(point.coords.y - predictedY, 2) +
        Math.pow(point.coords.z - predictedZ, 2)
      );
    }, 0);

    steps.push({
      type: "calculateSumOfSquaredErrors",
      title: "Calculate Sum of Squared Errors",
      state: {
        sumOfSquaredErrors,
        coefficients,
        means,
        predictionLine,
      },
      description: (
        <div>
          <p>
            We can calculate how good the line is by calculating the sum of
            squared errors.
          </p>
          <p>The sum of squared errors is {sumOfSquaredErrors.toFixed(2)}.</p>
        </div>
      ),
    });

    return steps;
  };
