from flask import Flask, jsonify, request
import cv2
import mediapipe as mp
import os
import math
import logging
import numpy as np
import threading

app = Flask(__name__)

# Initialize logging
logging.basicConfig(level=logging.DEBUG)

# Initialize mediapipe pose detection with lower complexity for better performance
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,  # Set to False for videos
    model_complexity=1,       # Lower complexity for faster performance
    min_detection_confidence=0.5,  # Adjust detection confidence
    min_tracking_confidence=0.5    # Adjust tracking confidence
)

# Set the output video path
output_video_path = r'D:\Temp downloads\testout.mp4'

# Function to process video and extract pose landmarks
def process_video(file_path, output_writer=None, frame_skip=2):
    video = cv2.VideoCapture(file_path)
    vectors = []
    
    if not video.isOpened():
        logging.error(f"Could not open video file: {file_path}")
        return vectors

    frame_count = 0

    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break

        frame_count += 1
        logging.info(f"Processing frame {frame_count}")  # Log the progress

        # Skip frames for faster processing
        if frame_count % frame_skip != 0:
            continue

        # Convert the frame to RGB
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the image and extract pose landmarks
        results = pose.process(image_rgb)

        # Calculate joint vectors if pose landmarks are detected
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Get the vectors representing hand movement
            hand_vector = calculate_hand_vector(landmarks)
            if hand_vector is not None:
                vectors.append(hand_vector)

            # Draw the pose landmarks on the frame
            draw_landmarks(frame, results.pose_landmarks)

        # Write frame to output video if an output writer is provided
        if output_writer:
            output_writer.write(frame)

    video.release()
    return vectors

# Function to calculate the vector representing hand movement
def calculate_hand_vector(landmarks):
    def create_vector(a, b):
        return np.array([b[0] - a[0], b[1] - a[1]])

    try:
        # Get coordinates for shoulder, elbow, and wrist
        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                 landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                 landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

        # Create vectors representing arm movement
        upper_arm_vector = create_vector(shoulder, elbow)
        lower_arm_vector = create_vector(elbow, wrist)

        # Return the vectors for further comparison
        return (upper_arm_vector, lower_arm_vector)

    except IndexError as e:
        logging.error(f"Error calculating hand vector: {str(e)}")
        return None

# Function to draw pose landmarks on the frame
def draw_landmarks(frame, pose_landmarks):
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    mp_drawing.draw_landmarks(
        frame,
        pose_landmarks,
        mp_pose.POSE_CONNECTIONS,
        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())

# Define a POST route to compare videos and return feedback
@app.route('/compare-videos', methods=['POST'])
def compare_videos():
    data = request.get_json()  # Expecting JSON with paths
    user_video_path = data.get('user_video_path')
    reference_video_path = data.get('reference_video_path')

    if not user_video_path or not reference_video_path:
        return jsonify({'error': 'Missing video paths'}), 400

    # Process the user's video and the professional reference video
    user_angles = process_video(user_video_path)
    reference_angles = process_video(reference_video_path)

    if len(user_angles) == 0 or len(reference_angles) == 0:
        return jsonify({'error': 'Could not analyze the videos'}), 500

    # Compare the vectors
    min_length = min(len(user_angles), len(reference_angles))
    feedback = compare_vectors(user_angles[:min_length], reference_angles[:min_length])

    # Return the feedback to the front end
    return jsonify({'feedback': feedback})

# Compare user's hand vectors with reference hand vectors
def compare_vectors(user_vectors, reference_vectors):
    feedback = ''
    vector_diffs = []

    for user_vector, ref_vector in zip(user_vectors, reference_vectors):
        upper_arm_diff = np.linalg.norm(user_vector[0] - ref_vector[0])
        lower_arm_diff = np.linalg.norm(user_vector[1] - ref_vector[1])
        
        # Combine the difference of both vectors for the arm
        vector_diff = (upper_arm_diff + lower_arm_diff) / 2
        vector_diffs.append(vector_diff)

    # Provide feedback based on average vector difference
    avg_vector_diff = sum(vector_diffs) / len(vector_diffs) if vector_diffs else 0
    if avg_vector_diff > 0.1:  # Tweak the threshold as needed for sensitivity
        feedback = f"Your hand movement is off by an average of {avg_vector_diff:.2f}. Try to match the professional's form."
    else:
        feedback = "Your hand movement looks good!"

    return feedback

if __name__ == '__main__':
    app.run(debug=True)
