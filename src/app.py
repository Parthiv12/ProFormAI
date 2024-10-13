from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import os
import logging
import numpy as np
import threading

# Flask app initialization
app = Flask(__name__)
CORS(app)

# Initialize logging
logging.basicConfig(level=logging.DEBUG)

# Mediapipe setup
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Output path
output_video_path = r'D:\Temp downloads\testout.mp4'

# Folder to store uploads
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
        if frame_count % frame_skip != 0:
            continue

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            hand_vector = calculate_hand_vector(landmarks)
            if hand_vector is not None:
                vectors.append(hand_vector)

            draw_landmarks(frame, results.pose_landmarks)

        if output_writer:
            output_writer.write(frame)

    video.release()
    return vectors

# Function to calculate hand movement vectors
def calculate_hand_vector(landmarks):
    def create_vector(a, b):
        return np.array([b[0] - a[0], b[1] - a[1]])

    try:
        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

        upper_arm_vector = create_vector(shoulder, elbow)
        lower_arm_vector = create_vector(elbow, wrist)

        return (upper_arm_vector, lower_arm_vector)

    except IndexError as e:
        logging.error(f"Error calculating hand vector: {str(e)}")
        return None

# Function to draw landmarks on the frame
def draw_landmarks(frame, pose_landmarks):
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles
    mp_drawing.draw_landmarks(
        frame,
        pose_landmarks,
        mp_pose.POSE_CONNECTIONS,
        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
    )

# Home route
@app.route('/')
def home():
    return "Flask app is running!"

# Route to handle video uploads
@app.route('/process-video', methods=['POST'])
def process_video_route():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400

    video = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    # Perform the analysis
    analysis_result = process_video(video_path)
    return jsonify({'analysis': analysis_result})

# Compare hand vectors
def compare_vectors(user_vectors, reference_vectors):
    feedback = ''
    vector_diffs = []

    for user_vector, ref_vector in zip(user_vectors, reference_vectors):
        upper_arm_diff = np.linalg.norm(user_vector[0] - ref_vector[0])
        lower_arm_diff = np.linalg.norm(user_vector[1] - ref_vector[1])
        vector_diff = (upper_arm_diff + lower_arm_diff) / 2
        vector_diffs.append(vector_diff)

    avg_vector_diff = sum(vector_diffs) / len(vector_diffs) if vector_diffs else 0
    if avg_vector_diff > 0.1:
        feedback = f"Your hand movement is off by {avg_vector_diff:.2f}. Try to match the professional's form."
    else:
        feedback = "Your hand movement looks good!"
    return feedback

if __name__ == '__main__':
    app.run(debug=True)
