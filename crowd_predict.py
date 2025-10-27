import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# -----------------------------
# Step 1: Prepare your data
# -----------------------------
# Example data: replace with your real dataset
data = {
    'hour': [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    'day_of_week': [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
    'is_holiday': [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    'crowd_size': [100, 150, 200, 300, 250, 400, 500, 450, 350, 300]
}

df = pd.DataFrame(data)

# Features and target
X = df[['hour', 'day_of_week', 'is_holiday']]
y = df['crowd_size']

# -----------------------------
# Step 2: Split data
# -----------------------------
# 60% training, 20% validation, 20% test
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
X_train, X_val, y_train, y_val = train_test_split(
    X_train_val, y_train_val, test_size=0.25, random_state=42
)  # 0.25 x 0.8 = 0.2

# -----------------------------
# Step 3: Train Random Forest
# -----------------------------
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# -----------------------------
# Step 4: Evaluate
# -----------------------------
# Predict
y_train_pred = model.predict(X_train)
y_val_pred = model.predict(X_val)
y_test_pred = model.predict(X_test)

# R² scores
print("R² scores:")
print(f"Training: {r2_score(y_train, y_train_pred):.3f}")
print(f"Validation: {r2_score(y_val, y_val_pred):.3f}")
print(f"Test: {r2_score(y_test, y_test_pred):.3f}")

# -----------------------------
# Step 5: Predict new crowd size
# -----------------------------
# Always pass a DataFrame with same column names
new_data = pd.DataFrame([[14, 3, 0]], columns=['hour', 'day_of_week', 'is_holiday'])
predicted_crowd = model.predict(new_data)
print(f"Predicted crowd size for {new_data.iloc[0].to_dict()}: {predicted_crowd[0]:.0f}")
