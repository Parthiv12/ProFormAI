import React, { useState } from 'react';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userVectors, setUserVectors] = useState([]);
  const [professionalVectors, setProfessionalVectors] = useState([]);

  // Handle video file input from the user
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setFeedback('');
    setUserVectors([]);
    setProfessionalVectors([]);
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

    // Get the feedback and vectors from the server
    const data = await response.json();
    setFeedback(`AI Feedback: ${data.feedback}`);
    setUserVectors(data.user_vectors);
    setProfessionalVectors(data.professional_vectors);
  };

  // Function to display the vectors in the UI
  const displayVectors = (userVectors, professionalVectors) => {
    if (userVectors.length === 0 || professionalVectors.length === 0) {
      return <p>No vectors to display.</p>;
    }

    return (
      <div className="vectors">
        <h3>User vs Professional Vectors</h3>
        <table>
          <thead>
            <tr>
              <th>Frame</th>
              <th>User Vector (Upper Arm)</th>
              <th>Professional Vector (Upper Arm)</th>
              <th>User Vector (Lower Arm)</th>
              <th>Professional Vector (Lower Arm)</th>
            </tr>
          </thead>
          <tbody>
            {userVectors.map((userVector, index) => {
              const professionalVector = professionalVectors[index] || [];
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{userVector[0]?.join(', ') || 'N/A'}</td>
                  <td>{professionalVector[0]?.join(', ') || 'N/A'}</td>
                  <td>{userVector[1]?.join(', ') || 'N/A'}</td>
                  <td>{professionalVector[1]?.join(', ') || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
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

        {/* Display Vectors */}
        {displayVectors(userVectors, professionalVectors)}
      </header>
    </div>
  );
}

export default App;
