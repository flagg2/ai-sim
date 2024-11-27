# Machine Learning Algorithms Visualizations - MLens

MLens is an interactive web application for visualizing machine learning algorithms, built with Three.js and React. This application serves as a supplementary learning material for students interested in machine learning, providing intuitive visual understanding of selected algorithms.

## Live Demo

Visit [https://ai-sim.wittlinger.dev](https://ai-sim.wittlinger.dev) to see the application in action.

## Features

- Interactive 2D and 3D visualizations of machine learning algorithms
- Step-by-step execution with detailed explanations
- Configurable algorithm parameters
- Mobile-friendly responsive design
- Currently implemented algorithms:
  - K-means Clustering
  - Linear Regression
  - Support Vector Machines (SVM)
  - Feed Forward Neural Network (FFNN)
  - Autoencoder
  - XGBoost

## Technology Stack

- TypeScript
- React
- Next.js
- Three.js
- React Three Fiber
- TailwindCSS
- ShadCN UI
- Docker

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) (v20.10.0 or higher)

### Installation and Running

1. Navigate to the root of the repository

   ```bash
   cd app
   ```

2. Build and run with Docker

   ```bash
   docker compose up
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
apps/
└── web/                         # Next.js web application
packages/
    ├── algorithms/              # Algorithm implementations and core logic
    ├── eslint-config/           # ESLint configuration files
    ├── typescript-config/       # TypeScript configuration files
    └── ui/                      # Reusable UI components and hooks
```

## Adding New Algorithms

The application is designed to be extensible. To add a new algorithm with a certain `{slug}`

1. Create a new file for the algorithm in `packages/algorithms/impl/{slug}/{slug}`
2. Implement the `AlgorithmDefinition` interface
3. Add algorithm's metadata to the registry in `packages/algorithms/impl/index.ts`

See existing algorithm implementations for examples.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related

This application was created as part of a bachelor's thesis at Faculty of Informatics, Masaryk University.
