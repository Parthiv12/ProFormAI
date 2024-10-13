import cv2
from train_and_test_model import predict_bicep_curls, train_model
from extract_features_from_videos import correct_features, incorrect_features

# Generate a video with likeliness percentage overlay
def generate_likeliness_video(model, input_video_path, output_video_path):
    cap = cv2.VideoCapture(input_video_path)

    # Set up video writer to save the output video with likeliness overlay
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Every 10 frames, we calculate the likeliness and overlay it
        if frame_count % 10 == 0:
            # Predict the likeliness of the video being a bicep curl
            likeliness = predict_bicep_curls(model, input_video_path) * 100  # Convert to percentage

            # Overlay the text on the frame
            cv2.putText(frame, f'Likeliness: {likeliness:.2f}%', (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

        # Write the frame with overlay to output video
        out.write(frame)

    cap.release()
    out.release()

# Example usage
if __name__ == "__main__":
    test_video_path = 'D:\\ProFormAI\\ProFormAI\\src\\testing\\f1.mp4'
    output_video_path = 'D:/temp downloads/likeliness.mp4'

    # Train the model
    model = train_model(correct_features, incorrect_features)

    # Generate video with likeliness overlay
    generate_likeliness_video(model, test_video_path, output_video_path)
    print(f'Video saved to {output_video_path}')
