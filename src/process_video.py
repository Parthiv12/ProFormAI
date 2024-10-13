import cv2
import mediapipe as mp
import numpy as np
import os

# Initialize Mediapipe pose detection
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def process_video(file_path):
    video = cv2.VideoCapture(file_path)
    keypoints_list = []
    
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break

        # Convert frame to RGB (Mediapipe expects RGB images)
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame to extract pose landmarks
        results = pose.process(image_rgb)
        
        # If pose landmarks are detected, extract keypoints
        if results.pose_landmarks:
            keypoints = []
            for landmark in results.pose_landmarks.landmark:
                keypoints.append([landmark.x, landmark.y, landmark.z])
            keypoints_list.append(keypoints)

    video.release()
    return keypoints_list  # Return as list, not numpy array

def process_videos_in_folder(folder_path):
    all_keypoints = []
    
    # Loop through all files in the folder
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".mp4"):
            file_path = os.path.join(folder_path, file_name)
            print(f"Processing {file_path}...")
            keypoints = process_video(file_path)
            all_keypoints.append(keypoints)  # Append each video's keypoints as a list
    
    return all_keypoints  # Return a list of lists, where each element is the keypoints for a video

# Example usage: Process all videos in folders
correct_keypoints = process_videos_in_folder(r'C:\Users\abhin\Desktop\ProFormAI\ProFormAI\src\Bicep Curls cor')
correct_keypoints = process_videos_in_folder('C:\\Users\\abhin\\Desktop\\ProFormAI\\ProFormAI\\src\\Bicep Curls cor')
