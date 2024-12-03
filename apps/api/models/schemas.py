from pydantic import BaseModel
from typing import List

class Coords(BaseModel):
    x: float
    y: float

class TrainingPoint(BaseModel):
    coords: Coords
    label: int
    id: int

class BoundaryPoint(BaseModel):
    coords: List[float]

class XGBoostConfig(BaseModel):
    trainingPoints: List[TrainingPoint]
    boundaryPoints: List[BoundaryPoint]
    maxDepth: int
    learningRate: float
    numTrees: int

class DecisionBoundaryPoint(BaseModel):
    x: float
    y: float
    prediction: float

class XGBoostResponse(BaseModel):
    decisionBoundary: List[DecisionBoundaryPoint] 