declare module "ml-svm" {
  interface SVMOptions {
    /** Regularization parameter (default: 1.0) */
    C?: number;
    /** Numerical tolerance (default: 1e-4) */
    tol?: number;
    /** Alpha tolerance, threshold to decide support vectors (default: 1e-6) */
    alphaTol?: number;
    /** Maximum number of passes through alphas without changing (default: 10) */
    maxPasses?: number;
    /** Maximum number of iterations (default: 10000) */
    maxIterations?: number;
    /** Kernel type: 'linear' | 'rbf' | 'polynomial' (default: 'linear') */
    kernel?: "linear" | "rbf" | "polynomial";
    /** Custom random number generator (default: Math.random) */
    random?: () => number;
  }

  class SVM {
    constructor(options?: SVMOptions);

    /** Create a SVM instance from a saved model */
    static load(model: object): SVM;

    /** Train the SVM model with features and labels in domain {1,-1} */
    train(features: number[][], labels: number[]): void;

    /**
     * Predict class for new features
     * Returns array of {-1,1} for multiple observations or single number for one observation
     */
    predict(features: number[][] | number[]): number[] | number;

    /**
     * Get margin for features
     * Returns array for multiple observations or single number for one observation
     */
    margin(features: number[][] | number[]): number[] | number;

    /** Get indices of support vectors (Warning: doesn't work for loaded models with linear kernel) */
    supportVectors(): number[];

    /** Alpha coefficients for each training example */
    alphas?: number[];

    /** Bias term (intercept) */
    b: number;
  }

  export default SVM;
}