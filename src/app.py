<<<<<<< HEAD
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import os
=======
from flask import Flask, jsonify
import cv2
import mediapipe as mp
import os
import math
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
import logging
import numpy as np
import threading

<<<<<<< HEAD
# Flask app initialization
app = Flask(__name__)
CORS(app)
=======
app = Flask(__name__)
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9

# Initialize logging
logging.basicConfig(level=logging.DEBUG)

<<<<<<< HEAD
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

=======
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

>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
# Function to process video and extract pose landmarks
def process_video(file_path, output_writer=None, frame_skip=2):
    video = cv2.VideoCapture(file_path)
    vectors = []
<<<<<<< HEAD

=======
    
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
    if not video.isOpened():
        logging.error(f"Could not open video file: {file_path}")
        return vectors

    frame_count = 0
<<<<<<< HEAD
=======

>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break

        frame_count += 1
<<<<<<< HEAD
        if frame_count % frame_skip != 0:
            continue

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
=======
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
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
            hand_vector = calculate_hand_vector(landmarks)
            if hand_vector is not None:
                vectors.append(hand_vector)

<<<<<<< HEAD
            draw_landmarks(frame, results.pose_landmarks)

=======
            # Draw the pose landmarks on the frame
            draw_landmarks(frame, results.pose_landmarks)

        # Write frame to output video if an output writer is provided
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
        if output_writer:
            output_writer.write(frame)

    video.release()
    return vectors

<<<<<<< HEAD
# Function to calculate hand movement vectors
=======
# Function to calculate the vector representing hand movement
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
def calculate_hand_vector(landmarks):
    def create_vector(a, b):
        return np.array([b[0] - a[0], b[1] - a[1]])

    try:
<<<<<<< HEAD
        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

        upper_arm_vector = create_vector(shoulder, elbow)
        lower_arm_vector = create_vector(elbow, wrist)

=======
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
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
        return (upper_arm_vector, lower_arm_vector)

    except IndexError as e:
        logging.error(f"Error calculating hand vector: {str(e)}")
        return None

<<<<<<< HEAD
# Function to draw landmarks on the frame
def draw_landmarks(frame, pose_landmarks):
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles
=======
# Function to draw pose landmarks on the frame
def draw_landmarks(frame, pose_landmarks):
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
    mp_drawing.draw_landmarks(
        frame,
        pose_landmarks,
        mp_pose.POSE_CONNECTIONS,
<<<<<<< HEAD
        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
    )

# Home route
=======
        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())

# Define a root route to test if the Flask app is running
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
@app.route('/')
def home():
    return "Flask app is running!"

<<<<<<< HEAD
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
=======
# Function to handle video processing in the background
def process_videos_in_background(user_video_path, reference_video_path):
    # Open the output video writer
    user_video = cv2.VideoCapture(user_video_path)
    width = int(user_video.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(user_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = user_video.get(cv2.CAP_PROP_FPS)
    output_writer = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))
    user_video.release()

    # Process the user's video and the professional reference video
    user_angles = process_video(user_video_path, output_writer)
    reference_angles = process_video(reference_video_path, output_writer)

    # Close the output video writer
    output_writer.release()

    # Compare angles
    if len(user_angles) == 0 or len(reference_angles) == 0:
        logging.error('Could not analyze the video due to insufficient data.')
    else:
        min_length = min(len(user_angles), len(reference_angles))
        feedback = compare_vectors(user_angles[:min_length], reference_angles[:min_length])
        logging.info(f"Video processing complete. Feedback: {feedback}")

# Route to compare the two specific videos and generate a visual output
@app.route('/compare-videos', methods=['GET', 'POST'])
def compare_videos():
    user_video_path = r'D:\Temp downloads\f1.mp4'  # Path to the user's video
    reference_video_path = r'D:\Temp downloads\p2copy.mp4'  # Path to the professional video

    # Start the video processing in a background thread
    thread = threading.Thread(target=process_videos_in_background, args=(user_video_path, reference_video_path))
    thread.start()

    return jsonify({'message': 'Video processing started in the background.'})

# Compare user's hand vectors with reference hand vectors
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
def compare_vectors(user_vectors, reference_vectors):
    feedback = ''
    vector_diffs = []

    for user_vector, ref_vector in zip(user_vectors, reference_vectors):
        upper_arm_diff = np.linalg.norm(user_vector[0] - ref_vector[0])
        lower_arm_diff = np.linalg.norm(user_vector[1] - ref_vector[1])
<<<<<<< HEAD
        vector_diff = (upper_arm_diff + lower_arm_diff) / 2
        vector_diffs.append(vector_diff)

    avg_vector_diff = sum(vector_diffs) / len(vector_diffs) if vector_diffs else 0
    if avg_vector_diff > 0.1:
        feedback = f"Your hand movement is off by {avg_vector_diff:.2f}. Try to match the professional's form."
    else:
        feedback = "Your hand movement looks good!"
=======
        
        # Combine the difference of both vectors for the arm
        vector_diff = (upper_arm_diff + lower_arm_diff) / 2
        vector_diffs.append(vector_diff)

    # Provide feedback based on average vector difference
    avg_vector_diff = sum(vector_diffs) / len(vector_diffs) if vector_diffs else 0
    if avg_vector_diff > 0.1:  # Tweak the threshold as needed for sensitivity
        feedback = f"Your hand movement is off by an average of {avg_vector_diff:.2f}. Try to match the professional's form."
    else:
        feedback = "Your hand movement looks good!"

>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
    return feedback

if __name__ == '__main__':
    app.run(debug=True)
