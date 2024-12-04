from fastapi import APIRouter, HTTPException
from models.schemas import XGBoostConfig, XGBoostResponse, DecisionBoundaryPoint
from services.xgboost import XGBoostService

router = APIRouter()

@router.post("/xgboost", response_model=XGBoostResponse)
async def run_xgboost(config: XGBoostConfig):
    try:
        X_train, y_train = XGBoostService.prepare_training_data(config.trainingPoints)
        
        model = XGBoostService.train_model(
            X_train,
            y_train,
            config.maxDepth,
            config.learningRate,
            config.numTrees
        )
        
        boundary_predictions = XGBoostService.predict_boundary(model, config.boundaryPoints)
        
        decision_boundary = [
            DecisionBoundaryPoint(
                x=point.coords[0],
                y=point.coords[1],
                prediction=float(pred)
            )
            for point, pred in zip(config.boundaryPoints, boundary_predictions)
        ]
        
        return XGBoostResponse(decisionBoundary=decision_boundary)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process XGBoost model: {str(e)}"
        )