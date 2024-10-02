// "use client";

// import { useState } from "react";
// import { useSVM } from "@repo/simulations/hooks/useSVM";
// import SimulationUI from "@repo/ui/components/custom/SimulationUI";
// import { Slider } from "@repo/ui/components/shadcn/slider";
// import { Label } from "@repo/ui/components/custom/Label";
// import Header from "@repo/ui/components/custom/Header";
// import SVMVisualization from "./canvas";

// export default function SVMPage() {
//   const [numberOfPoints, setNumberOfPoints] = useState(20);
//   const [maxIterations, setMaxIterations] = useState(10);
//   const [learningRate, setLearningRate] = useState(0.01);

//   const svm = useSVM({
//     numberOfPoints,
//     maxIterations,
//     learningRate,
//   });

//   return (
//     <>
//       <Header title="Support Vector Machine" />
//       <SimulationUI
//         simulation={svm}
//         sceneContent={<SVMVisualization svm={svm} />}
//         configComponent={
//           <SVMConfig
//             numberOfPoints={numberOfPoints}
//             maxIterations={maxIterations}
//             learningRate={learningRate}
//             onNumberOfPointsChange={setNumberOfPoints}
//             onMaxIterationsChange={setMaxIterations}
//             onLearningRateChange={setLearningRate}
//           />
//         }
//         algorithmDescription="
//         Support Vector Machine (SVM) is a supervised learning algorithm used for classification and regression tasks. It works by finding the hyperplane that best separates different classes in the feature space, maximizing the margin between the classes.
//         "
//       />
//     </>
//   );
// }

// type SVMConfigProps = {
//   numberOfPoints: number;
//   maxIterations: number;
//   learningRate: number;
//   onNumberOfPointsChange: (numberOfPoints: number) => void;
//   onMaxIterationsChange: (maxIterations: number) => void;
//   onLearningRateChange: (learningRate: number) => void;
// };

// function SVMConfig({
//   numberOfPoints,
//   maxIterations,
//   learningRate,
//   onNumberOfPointsChange,
//   onMaxIterationsChange,
//   onLearningRateChange,
// }: SVMConfigProps) {
//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <Label
//         label="Number of points"
//         info="The number of training points to generate"
//       >
//         <Slider
//           value={[numberOfPoints]}
//           onValueChange={(value) => onNumberOfPointsChange(value[0]!)}
//           min={10}
//           max={100}
//           step={1}
//         />
//         <div className="text-xs text-darkish-text">{numberOfPoints}</div>
//       </Label>
//       <Label
//         label="Max Iterations"
//         info="Maximum number of optimization iterations"
//       >
//         <Slider
//           value={[maxIterations]}
//           onValueChange={(value) => onMaxIterationsChange(value[0]!)}
//           min={1}
//           max={5000}
//           step={1}
//         />
//         <div className="text-xs text-darkish-text">{maxIterations}</div>
//       </Label>
//       <Label label="Learning Rate" info="Step size for hyperplane optimization">
//         <Slider
//           value={[learningRate]}
//           onValueChange={(value) => onLearningRateChange(value[0]!)}
//           min={0.01}
//           max={0.1}
//           step={0.01}
//         />
//         <div className="text-xs text-darkish-text">
//           {learningRate.toFixed(3)}
//         </div>
//       </Label>
//     </div>
//   );
// }

export default function SVMPage() {
  return <div>SVM</div>;
}
