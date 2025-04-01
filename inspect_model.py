import pickle

# Load the model
with open("trained_model.pkl", "rb") as f:
    model = pickle.load(f)

# Print model details
print("Loaded Model Type:", type(model))
print("\nModel Parameters:\n", model.get_params() if hasattr(model, "get_params") else "No parameters available.")
