from typing import List, Dict, Tuple
import numpy as np
from sklearn.svm import SVC

# Define input type for points
Point = Dict[str, Dict[str, float]]

def calculate_svm_hyperplane(points: List[Point]) -> Tuple[List[Dict[str, float]], Dict[str, float], float]:
    # Extract coordinates and labels from points
    X = np.array([[p['transformedCoords']['x'], p['transformedCoords']['y'], p['transformedCoords']['z']] for p in points])
    y = np.array([p['label'] for p in points])

    # Fit an SVM model with a linear kernel
    clf = SVC(kernel='linear')
    clf.fit(X, y)

    # Retrieve support vectors, normal vector (w), and bias (intercept)
    support_vectors = clf.support_vectors_
    w = clf.coef_[0]  # Normal vector to the hyperplane
    b = clf.intercept_[0]  # Bias term

    # Format support vectors as a list of dictionaries
    support_vectors_formatted = [{"x": sv[0], "y": sv[1], "z": sv[2]} for sv in support_vectors]

    # Format normal vector as a dictionary
    normal_vector = {"x": w[0], "y": w[1], "z": w[2]}

    return support_vectors_formatted, normal_vector, b
