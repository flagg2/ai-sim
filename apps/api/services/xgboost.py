import xgboost as xgb
import numpy as np
from typing import List
from models.schemas import TrainingPoint, BoundaryPoint, DecisionBoundaryPoint

class XGBoostService:
    @staticmethod
    def prepare_training_data(training_points: List[TrainingPoint]):
        train_points = [
            p if p.label != -1 else TrainingPoint(coords=p.coords, label=0, id=p.id)
            for p in training_points
        ]
        X_train = np.array([[p.coords.x, p.coords.y] for p in train_points])
        y_train = np.array([p.label for p in train_points])
        return X_train, y_train

    @staticmethod
    def train_model(X_train: np.ndarray, y_train: np.ndarray, max_depth: int, learning_rate: float, num_trees: int):
        dtrain = xgb.DMatrix(X_train, label=y_train)
        params = {
            'max_depth': max_depth,
            'eta': learning_rate,
            'objective': 'binary:logistic',
            'eval_metric': 'error'
        }
        return xgb.train(params, dtrain, num_boost_round=num_trees)

    @staticmethod
    def predict_boundary(model: xgb.Booster, boundary_points: List[BoundaryPoint]):
        X_boundary = np.array([[p.coords[0], p.coords[1]] for p in boundary_points])
        boundary_dmatrix = xgb.DMatrix(X_boundary)
        return model.predict(boundary_dmatrix) 