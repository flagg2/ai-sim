import type { DataPoint, SVMDefinition } from "./types";
import type { Coords3D } from "../common/types";
import { solveQP } from "quadprog";
import { Matrix } from "ml-matrix";
import { mean, std } from "mathjs";
// Function to manually concatenate two matrices along columns
function concatMatricesColumnWise(matrixA: Matrix, matrixB: Matrix): Matrix {
  const rows = matrixA.rows;
  const colsA = matrixA.columns;
  const colsB = matrixB.columns;
  const result = Matrix.zeros(rows, colsA + colsB);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < colsA; j++) {
      result.set(i, j, matrixA.get(i, j));
    }
    for (let j = 0; j < colsB; j++) {
      result.set(i, j + colsA, matrixB.get(i, j));
    }
  }

  return result;
}

export const getSVMSteps: SVMDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];
  const { points } = config;

  // Step 1: Normalize the data
  const xValues = points.map((point) => point.coords.x);
  const yValues = points.map((point) => point.coords.y);

  // Calculate means and standard deviations for x and y
  const meanX = mean(xValues);
  const meanY = mean(yValues);
  const stdDevX = std(xValues, "uncorrected");
  const stdDevY = std(yValues, "uncorrected");

  // Standardize each point
  const X = points.map((point) => [
    (point.coords.x - meanX) / Number(stdDevX),
    (point.coords.y - meanY) / Number(stdDevY),
  ]);

  const y = points.map((point) => point.label);

  console.log({ X, y });

  const n = X[0].length; // Number of features (2)
  const m = X.length; // Number of data points (6)

  // Initialize Dmat as an identity matrix for w terms and zeros for bias term
  const Dmat = Matrix.zeros(n + 1, n + 1);
  for (let i = 0; i < n; i++) {
    Dmat.set(i, i, 1.0);
  }
  // Add reasonable regularization for numerical stability
  Dmat.set(n, n, 1e-6);

  // dvec is a zero vector since there's no linear term in the objective
  const dvec = Matrix.zeros(n + 1, 1);

  // Initialize Amat - needs to be transposed from current implementation
  const Amat = new Matrix(m, n + 1); // m x (n+1) matrix instead of (n+1) x m

  for (let i = 0; i < m; i++) {
    const xi = X[i];
    const yi = y[i];

    // Correct the signs here
    for (let j = 0; j < n; j++) {
      Amat.set(i, j, yi * xi[j]);
    }
    Amat.set(i, n, yi);
  }

  // Set bvec to a vector of ones
  const bvec = Matrix.ones(m, 1);

  // Convert to arrays and transpose Amat for quadprog
  const DmatArr = Dmat.to2DArray();
  const dvecArr = dvec.to1DArray();
  const AmatArr = Amat.transpose().to2DArray();
  const bvecArr = bvec.to1DArray();

  console.log(JSON.stringify({ DmatArr, dvecArr, AmatArr, bvecArr }, null, 2));

  const meq = 0; // Number of equality constraints

  const result = solveQP(DmatArr, dvecArr, AmatArr, bvecArr, meq);

  // Extract the solution vector
  const xstar = result.solution; // [w1, w2, b]

  console.log({ xstar });

  const w = xstar.slice(0, n); // Weight vector [w1, w2]
  const b = xstar[n]; // Bias term

  return steps;
};
