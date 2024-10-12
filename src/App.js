import './App.css';
import { useState } from 'react';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Handle video file input
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setFeedback(''); // Clear feedback when a new video is uploaded
  };

  // Simulate AI-based feedback (replace with actual AI analysis later)
  const analyzeForm = () => {
    if (!videoFile) {
      setFeedback('Please upload a video first!');
      return;
    }

    // Simulated feedback
    const suggestions = [
      "Keep your back straight",
      "Lower your hips",
      "Maintain a consistent tempo",
      "Engage your core",
      "Don't lock your knees"
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    // Simulate AI processing delay
    setTimeout(() => {
      setFeedback(`AI Feedback: ${randomSuggestion}`);
    }, 1000); // 1-second delay for simulation
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ProFormAI - Workout Form Analysis</h1>
        <p>Upload a workout video for form analysis!</p>
        
        {/* Video file input */}
        <input type="file" id="videoInput" accept="video/*" onChange={handleVideoUpload} />
        
        {/* Button to trigger the AI analysis */}
        <button onClick={analyzeForm}>Analyze Form</button>

        {/* Display AI feedback */}
        <div className="feedback">
          {feedback && <p>{feedback}</p>}
        </div>

        {/* Display video preview (optional) */}
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

