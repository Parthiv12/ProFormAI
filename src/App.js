from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import os
import math

app = Flask(__name__)

# Root route to handle 404 errors and test if Flask is running
@app.route('/')
def home():
    return "Flask app is running!"

# Initialize mediapipe pose detection
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Function to process video and extract pose landmarks
def process_video(file_path):
    video = cv2.VideoCapture(file_path)
    angles = []
    
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break

        # Convert the frame to RGB
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the image and extract pose landmarks
        results = pose.process(image_rgb)

        # Calculate joint angles if pose landmarks are detected
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            angles.append(calculate_elbow_angle(landmarks))

    video.release()
    return angles

# Function to calculate the elbow angle
def calculate_elbow_angle(landmarks):
    def calculate_angle(a, b, c):
        angle = abs(math.degrees(math.atan2(c[1] - b[1], c[0] - b[0]) - 
                                  math.atan2(a[1] - b[1], a[0] - b[0])))
        return angle if angle < 180 else 360 - angle

    # Get coordinates for shoulder, elbow, wrist
    shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
             landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
             landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

    return calculate_angle(shoulder, elbow, wrist)

# Route to handle video uploads and analysis
@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    if 'video' not in request.files:
        return jsonify({'feedback': 'No video uploaded'}), 400
    
    video = request.files['video']
    video_path = os.path.join('uploads', video.filename)
    video.save(video_path)

    # Process the uploaded video and the professional reference video
    user_angles = process_video(video_path)
    reference_angles = process_video('reference_video.mp4')  # Path to the professional video

    # Compare the angles and generate feedback
    feedback = compare_angles(user_angles, reference_angles)

    return jsonify({'feedback': feedback})

# Compare user's angles with reference angles
def compare_angles(user_angles, reference_angles):
    feedback = ''
    if len(user_angles) > 0 and len(reference_angles) > 0:
        angle_difference = abs(user_angles[0] - reference_angles[0])  # Compare the first frame's elbow angle

        if angle_difference > 10:
            feedback = f"Your elbow angle is off by {angle_difference:.2f} degrees. Try to match the professional's form."
        else:
            feedback = "Your form looks good!"
    else:
        feedback = "Could not analyze the video."

    return feedback

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
