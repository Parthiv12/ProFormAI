import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [workoutDays, setWorkoutDays] = useState({ legs: '', arms: '', abs: '' });
  const [motivationQuote, setMotivationQuote] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Camera and Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Fetch available cameras
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);

        // Automatically set the first camera as the default selected one
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error fetching media devices:', error);
      }
    }

    getCameras();
  }, []);

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
    setTimeout(() => {
      const simulatedFeedback = "Keep your back straight and lower your hips.";
      setFeedback(`AI Feedback: ${simulatedFeedback}`);
    }, 2000); // Simulate a 2-second delay for analysis
  };

  // Fetch a motivational quote using API Ninjas
  const getMotivationQuote = async () => {
    const apiKey = '/59LuNECefFLLiS2cBhsmg==LaJvsXgI06t4yJcn'; // Your API key

    try {
      const category = 'happiness'; // You can change the category as needed
      const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        method: 'GET',
        headers: { 'X-Api-Key': apiKey },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const quote = data[0].quote;
      const author = data[0].author;
      setMotivationQuote(`${quote} — ${author}`);
    } catch (error) {
      console.error("Error fetching the motivational quote:", error.message);
      setMotivationQuote("Stay motivated and keep pushing your limits!"); // Fallback message
    }
  };

  // Start the camera stream
  const startCamera = async () => {
    if (!selectedCamera) {
      alert('Please select a camera.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera },
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Start recording the video
  const startRecording = () => {
    setRecordedChunks([]); // Reset the recorded chunks
    setIsRecording(true);

    const stream = videoRef.current.srcObject;
    const options = { mimeType: 'video/webm' };
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
  };

  // Stop recording the video
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      setRecordedVideoURL(videoURL);
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ProFormAI - Dumbbell Curl Analysis</h1>
        <p>Upload your workout video for AI-based form analysis or record a new one below.</p>

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

          {/* Camera Selection and Recording Section */}
          <div className="camera-section">
            <h2>Record a Video</h2>

            {/* Camera Selection Dropdown */}
            {availableCameras.length > 0 ? (
              <select onChange={(e) => setSelectedCamera(e.target.value)} value={selectedCamera}>
                {availableCameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId}`}
                  </option>
                ))}
              </select>
            ) : (
              <p>No cameras available</p>
            )}

            <video ref={videoRef} autoPlay playsInline width="400" />
            {!isRecording && <button onClick={startCamera}>Start Camera</button>}
            {isRecording ? (
              <button onClick={stopRecording}>Stop Recording</button>
            ) : (
              <button onClick={startRecording}>Start Recording</button>
            )}
          </div>

          {/* Display the recorded video */}
          {recordedVideoURL && (
            <div>
              <h3>Recorded Video:</h3>
              <video width="400" controls>
                <source src={recordedVideoURL} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
