from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
from extract_features_from_videos import correct_features, incorrect_features  # Import from the feature extraction file

# Example: Labels for correct (1) and incorrect (0) forms
labels = np.concatenate([np.ones(len(correct_features)), np.zeros(len(incorrect_features))])

# Combine features
features = np.concatenate([correct_features, incorrect_features], axis=0)

# Reshape features to 2D for the classifier
X = np.array([np.mean(f, axis=0) for f in features])  # Example: using mean elbow angle as feature
y = labels

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a RandomForestClassifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Make predictions and evaluate the model
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy}")
