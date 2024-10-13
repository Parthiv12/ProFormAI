from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import numpy as np
from process_video import process_videos_in_folder, process_video  # Process videos only once
from extract_features_from_videos import extract_multiple_features  # Import the correct feature extraction function

# Process correct and incorrect form videos only once
print("Processing correct form videos...")
<<<<<<< HEAD
correct_keypoints = process_videos_in_folder(r'C:\Users\abhin\Desktop\ProFormAI\ProFormAI\src\Bicep Curls cor')

print("Processing incorrect form videos...")
incorrect_keypoints = process_videos_in_folder(r'C:\Users\abhin\Desktop\ProFormAI\ProFormAI\src\Bicep Curls cor')
=======
correct_keypoints = process_videos_in_folder('D:\\ProFormAI\\ProFormAI\\src\\Bicep Curls cor')

print("Processing incorrect form videos...")
incorrect_keypoints = process_videos_in_folder('D:\\ProFormAI\\ProFormAI\\src\\Bicep Curls incor')
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9

# Extract features only once
print("Extracting features for correct form...")
correct_features = extract_multiple_features(correct_keypoints)

print("Extracting features for incorrect form...")
incorrect_features = extract_multiple_features(incorrect_keypoints)

# Train the model on correct and incorrect features
def train_model(correct_features, incorrect_features):
    # Filter out invalid features (e.g., NaN values)
    correct_features = [f for f in correct_features if not np.isnan(f).any()]
    incorrect_features = [f for f in incorrect_features if not np.isnan(f).any()]

    if len(correct_features) == 0 or len(incorrect_features) == 0:
        raise ValueError("No valid features extracted from the videos.")

    # Labels: 1 for correct (bicep curls), 0 for incorrect (non-bicep curls)
    labels = np.concatenate([np.ones(len(correct_features)), np.zeros(len(incorrect_features))])

    # Combine features from correct and incorrect examples
    features = np.concatenate([correct_features, incorrect_features], axis=0)

    # Reshape features to be 2D for RandomForestClassifier
    X = np.array(features)  # Multiple features are already in 2D
    y = labels

    # Split into train and test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the RandomForestClassifier
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    # Make predictions
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy}")
    print(classification_report(y_test, y_pred))

    return clf


# Predict whether the video is a bicep curl or not and return the likelihood
def predict_bicep_curls(model, video_path):
    keypoints = process_video(video_path)  # Extract keypoints from the video
    if len(keypoints) == 0:
        return 0.0  # If no keypoints are detected

    features = extract_multiple_features([keypoints])  # Extract multiple features from the test video
    if len(features) == 0:
        return 0.0  # No valid features extracted

    prediction = model.predict_proba(features)  # Get probability of being a bicep curl

    # Return the probability of the video being a bicep curl (1 corresponds to bicep curls class)
    if len(prediction[0]) > 1:
        return prediction[0][1]  # Return class 1 (bicep curl)
    else:
        return prediction[0][0]  # If only one class is returned, use class 0


# Example usage: Predict the likeliness of a new video being bicep curls
if __name__ == "__main__":
    test_video_path = 'D:\\ProFormAI\\ProFormAI\\src\\testing\\f1.mp4'

    # Train the model
    print("Training the model...")
    model = train_model(correct_features, incorrect_features)

    # Predict likeliness
    print(f"Processing test video: {test_video_path}")
    likeliness = predict_bicep_curls(model, test_video_path)
    print(f'Likeliness of the video being bicep curls: {likeliness * 100:.2f}%')
