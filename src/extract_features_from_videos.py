import math
import mediapipe as mp
import numpy as np
from process_video import process_videos_in_folder

mp_pose = mp.solutions.pose

# Function to calculate the angle between three points
def calculate_angle(a, b, c):
    # a, b, c are keypoints (e.g., shoulder, elbow, wrist)
    angle = math.degrees(math.atan2(c[1] - b[1], c[0] - b[0]) -
                         math.atan2(a[1] - b[1], a[0] - b[0]))
    return abs(angle)

# Extract multiple features (e.g., elbow, shoulder, wrist angles) from keypoints
def extract_multiple_features(keypoints):
    features = []
    for video in keypoints:  # Loop through all videos
        video_features = []
        for frame in video:  # Loop through all frames in each video
            # Extract multiple joint angles (shoulder, elbow, wrist, etc.)
            try:
                shoulder = frame[mp_pose.PoseLandmark.LEFT_SHOULDER.value][:2]
                elbow = frame[mp_pose.PoseLandmark.LEFT_ELBOW.value][:2]
                wrist = frame[mp_pose.PoseLandmark.LEFT_WRIST.value][:2]

                # Calculate angles
                elbow_angle = calculate_angle(shoulder, elbow, wrist)
                shoulder_angle = calculate_angle([0, 0], shoulder, elbow)  # Add other angles

                # Add both angles to the features for this frame
                video_features.append([elbow_angle, shoulder_angle])
            except IndexError:
                continue

        if video_features:
            # Use the mean of features across all frames
            features.append(np.mean(video_features, axis=0))
    
    return np.array(features)

# Example usage:
if __name__ == "__main__":
    correct_keypoints = process_videos_in_folder('D:\\ProFormAI\\ProFormAI\\src\\Bicep Curls cor')
    incorrect_keypoints = process_videos_in_folder('D:\\ProFormAI\\ProFormAI\\src\\Bicep Curls incor')

    # Extract features for correct and incorrect forms
    correct_features = extract_multiple_features(correct_keypoints)
    incorrect_features = extract_multiple_features(incorrect_keypoints)
