import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# Load the model
with open("trained_model.pkl", "rb") as file:
    model = pickle.load(file)

# Check if the model is loaded correctly
print(f"Loaded Model Type: {type(model)}")

# Generate dummy input data (assuming the model was trained on numerical features)
sample_input = np.random.rand(1, model.n_features_in_)

# Make a prediction
prediction = model.predict(sample_input)

print(f"Sample Input: {sample_input}")
print(f"Predicted Output: {prediction}")
