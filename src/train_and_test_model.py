import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from process_video import process_videos_in_folder, process_video
from extract_features_from_videos import extract_multiple_features

# Path for the professional video (change this to match your professional video)
PROFESSIONAL_VIDEO_PATH = 'D:\\Temp downloads\\bicep curl professional.mp4'
USER_VIDEO_PATH = 'D:\\ProFormAI\\ProFormAI\\src\\Bicep Curls incor\\1hs14h.mp4'

# Function to process the videos and extract features
def process_and_extract_features():
    exercise_types = {
        'bicep_curls': 'Bicep Curls',
        'lunges': 'Lunges',
        'pushups': 'Pushups'
    }

    print("Processing videos...")
    videos_dict = {}
    for exercise, label in exercise_types.items():
        videos_dict[f"{exercise}_correct"] = process_videos_in_folder(f'D:\\ProFormAI\\ProFormAI\\src\\{label} cor')
        print(f"Finished processing correct form for {label} videos.")
        videos_dict[f"{exercise}_incorrect"] = process_videos_in_folder(f'D:\\ProFormAI\\ProFormAI\\src\\{label} incor')
        print(f"Finished processing incorrect form for {label} videos.")

    # Extract features for each exercise and form
    features_dict = {}
    for exercise in exercise_types.keys():
        features_dict[f"{exercise}_correct"] = extract_multiple_features(videos_dict[f"{exercise}_correct"])
        print(f"Extracted features for {exercise} (correct form).")
        features_dict[f"{exercise}_incorrect"] = extract_multiple_features(videos_dict[f"{exercise}_incorrect"])
        print(f"Extracted features for {exercise} (incorrect form).")

    return features_dict

# Function to compare user and professional video features
def compare_user_with_professional(user_video_path, professional_video_path):
    print("Processing user video...")
    user_keypoints = process_video(user_video_path)
    user_features = extract_multiple_features([user_keypoints])

    print("Processing professional video...")
    professional_keypoints = process_video(professional_video_path)
    professional_features = extract_multiple_features([professional_keypoints])

    print("Comparing user video with professional video...")
    if len(user_features) == 0 or len(professional_features) == 0:
        print("Unable to extract valid features from the videos.")
        return

    # Calculate the difference between the user and professional video features
    user_mean = np.mean(user_features, axis=0)
    professional_mean = np.mean(professional_features, axis=0)

    # Use Euclidean distance to measure similarity
    distance = np.linalg.norm(user_mean - professional_mean)
    similarity_percentage = max(0, 100 - (distance * 100))  # Example similarity calculation

    print(f"Similarity to professional: {similarity_percentage:.2f}%")

# Function to train the model
def train_model(features_dict):
    exercise_types = {
        'bicep_curls': 'Bicep Curls',
        'lunges': 'Lunges',
        'pushups': 'Pushups'
    }

    # Combine features and generate labels
    print("Preparing data for training...")

    incorrect_features = np.concatenate([features_dict[f"{exercise}_incorrect"] for exercise in exercise_types.keys()], axis=0)
    feature_arrays = [features_dict[f"{exercise}_correct"] for exercise in exercise_types.keys()] + [incorrect_features]

    features = np.concatenate(feature_arrays, axis=0)
    labels = np.concatenate([
        np.ones(len(features_dict['bicep_curls_correct'])),  # Bicep Curls (label: 1)
        2 * np.ones(len(features_dict['lunges_correct'])),   # Lunges (label: 2)
        3 * np.ones(len(features_dict['pushups_correct'])),  # Pushups (label: 3)
        np.zeros(len(incorrect_features))                   # Incorrect form (label: 0)
    ])

    print(f"Features shape: {features.shape}")
    print(f"Labels shape: {labels.shape}")

    # Train and test split
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

    print("Training model...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy}")
    print(classification_report(y_test, y_pred))

    return clf

# Main entry point for the script
if __name__ == "__main__":
    # Step 1: Process the videos and extract features
    features_dict = process_and_extract_features()

    # Step 2: Train the model using the extracted features
    model = train_model(features_dict)

    # Step 3: Compare the user's video with the professional video
    compare_user_with_professional(USER_VIDEO_PATH, PROFESSIONAL_VIDEO_PATH)

    print("Training and comparison complete!")
