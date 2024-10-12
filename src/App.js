import React, { useState } from 'react';
import './App.css';

function App() {
  const [workoutDays, setWorkoutDays] = useState({ legs: '', arms: '', abs: '' });
  const [motivationQuote, setMotivationQuote] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Predefined reference video of a professional doing dumbbell curls
  const referenceVideo = "path/to/professional-dumbbell-curl-video.mp4";

  // Handle video file input from the user
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setFeedback(''); // Clear feedback when a new video is uploaded
  };

  // Simulate AI-based feedback (to be replaced with actual AI processing)
  const analyzeForm = () => {
    if (!videoFile) {
      setFeedback('Please upload a video first!');
      return;
    }

    setFeedback('Processing your video...');

    // Simulate form analysis and feedback (replace with your AI processing)
    setTimeout(() => {
      const simulatedFeedback = "Keep your back straight and lower your hips.";
      setFeedback(`AI Feedback: ${simulatedFeedback}`);
    }, 2000); // Simulate a 2-second delay for analysis
  };

  // Fetch a motivational quote from ZenQuotes API
  const getMotivationQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      const quote = data[0].q; // Extract the quote text
      setMotivationQuote(quote);
    } catch (error) {
      console.error("Error fetching the motivational quote: ", error);
      setMotivationQuote("Stay motivated and keep pushing your limits!");
    }
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

        {/* Video and Form Container */}
        <div className="content-wrapper">
          {/* Display uploaded video preview */}
          {videoFile && (
            <video width="400" controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Workout schedule input and motivational quote */}
          <div className="workout-motivation">
            <h2>Workout Schedule</h2>
            <label>
              Legs Day:
              <input type="text" name="legs" value={workoutDays.legs} onChange={(e) => setWorkoutDays({ ...workoutDays, legs: e.target.value })} />
            </label>
            <label>
              Arms Day:
              <input type="text" name="arms" value={workoutDays.arms} onChange={(e) => setWorkoutDays({ ...workoutDays, arms: e.target.value })} />
            </label>
            <label>
              Abs Day:
              <input type="text" name="abs" value={workoutDays.abs} onChange={(e) => setWorkoutDays({ ...workoutDays, abs: e.target.value })} />
            </label>
            <button onClick={getMotivationQuote}>Get Motivational Quote</button>

            {/* Display the motivational quote */}
            {motivationQuote && <p className="motivation-quote">{motivationQuote}</p>}
          </div>
        </div>

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
