import React, { useState } from 'react';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Handle video file input from the user
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setFeedback(''); // Clear previous feedback when a new video is uploaded
  };

  // Send video to back-end for analysis
  const analyzeForm = async () => {
    if (!videoFile) {
      setFeedback('Please upload a video first!');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    // Send the video to the back-end
    const response = await fetch('http://localhost:5000/analyze-video', {
      method: 'POST',
      body: formData,
    });

    // Get the feedback from the server
    const data = await response.json();
    setFeedback(`AI Feedback: ${data.feedback}`);
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
      </header>
    </div>
  );
}

export default App;
