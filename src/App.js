import React, { useState } from 'react';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Predefined reference video of a professional doing dumbbell curls
  const referenceVideo = "path/to/professional-dumbbell-curl-video.mp4";

  // Handle video file input from the user
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setFeedback(''); // Clear any previous feedback when a new video is uploaded
  };

  // Simulate AI-based feedback (to be replaced with actual AI processing)
  const analyzeForm = () => {
    if (!videoFile) {
      setFeedback('Please upload a video first!');
      return;
    }

    // Simulate form analysis and feedback (replace this with your AI processing)
    setFeedback('Processing your video...');
    
    setTimeout(() => {
      const simulatedFeedback = "Keep your back straight and lower your hips.";
      setFeedback(`AI Feedback: ${simulatedFeedback}`);
    }, 2000); // Simulate a 2-second delay for analysis
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ProFormAI - Dumbbell Curl Analysis</h1>
        <p>Upload your workout video for AI-based form analysis.</p>
        
        {/* User Video Upload Input */}
        <input type="file" id="videoInput" accept="video/*" onChange={handleVideoUpload} />
        
        {/* Button to trigger the analysis */}
        <button onClick={analyzeForm}>Analyze Form</button>

        {/* Display AI feedback */}
        <div className="feedback">
          {feedback && <p>{feedback}</p>}
        </div>

        {/* Display uploaded video preview */}
        {videoFile && (
          <video width="400" controls>
            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Display professional reference video for comparison */}
        <h3>Reference Video:</h3>
        <video width="400" controls>
          <source src={referenceVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </header>
    </div>
  );
}

export default App;
