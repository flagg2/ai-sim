from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import xgboost as xgb
import numpy as np

app = FastAPI()

# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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

@app.post("/api/xgboost")
async def run_xgboost(config: XGBoostConfig):
    try:
        # Prepare training data
        train_points = [p if p.label != -1 else TrainingPoint(coords=p.coords, label=0, id=p.id) for p in config.trainingPoints]
        
        # Debug print
        print(f"Number of training points: {len(train_points)}")
        
        # Convert training data to numpy arrays
        X_train = np.array([[p.coords.x, p.coords.y] for p in train_points])
        y_train = np.array([p.label for p in train_points])
        
        # Debug prints
        print(f"Training data shape: {X_train.shape}")
        print(f"Training labels shape: {y_train.shape}")
        print(f"Unique labels: {np.unique(y_train)}")

        # Create DMatrix for training
        dtrain = xgb.DMatrix(X_train, label=y_train)

        # Set XGBoost parameters
        params = {
            'max_depth': config.maxDepth,
            'eta': config.learningRate,
            'objective': 'binary:logistic',
            'eval_metric': 'error'
        }

        # Train model
        model = xgb.train(
            params,
            dtrain,
            num_boost_round=config.numTrees
        )

        # Prepare boundary points for prediction
        X_boundary = np.array([[p.coords[0], p.coords[1]] for p in config.boundaryPoints])
        
        # Debug print
        print(f"Boundary points shape: {X_boundary.shape}")
        
        # Predict boundary points
        boundary_dmatrix = xgb.DMatrix(X_boundary)
        boundary_predictions = model.predict(boundary_dmatrix)
        
        # Round predictions to 0 or 1, then transform 0 to -1
      #   boundary_predictions = np.where(np.round(boundary_predictions) == 0, -1, 1)
        
        # Debug prints
        print(f"Prediction range: {boundary_predictions.min():.3f} to {boundary_predictions.max():.3f}")
        print(f"Sample predictions: {boundary_predictions[:5]}")

        decision_boundary = [
            {
                "x": point.coords[0],
                "y": point.coords[1],
                "prediction": float(pred)
            }
            for point, pred in zip(config.boundaryPoints, boundary_predictions)
        ]

        return {"decisionBoundary": decision_boundary}

    except Exception as e:
        print(f"Error processing XGBoost model: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process XGBoost model: {str(e)}"
        )