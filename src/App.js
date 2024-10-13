import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState('');
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      })
      .catch((err) => console.error('Error accessing camera:', err));
  };

  const stopCamera = () => {
    if (videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);
      setVideoUrl(videoUrl);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  return (
    <div className="App">
      {/* Main Header Section */}
      <header
        className="main-header"
        style={{
          backgroundImage: `url(https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg)`,
        }}
      >
        <div className="overlay">
          <div className="content-wrapper">
            <h1>ProFormAI</h1>
            <p>Enhance your workout form with AI-based analysis.</p>
            <button className="get-started-btn">Get Started</button>
          </div>
        </div>
      </header>

      {/* About Us Section */}
      <section
        id="aboutSection"
        className="about-section"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-photo/fitness-concept-with-equipment-frame_23-2148531436.jpg)`,
        }}
      >
        <div className="about-container">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              ProFormAI was created with a mission to revolutionize how fitness enthusiasts approach their workouts. Our
              web app allows users to record themselves performing specific exercises, compare their form to
              professional standards, and receive feedback and recommendations on areas for improvement from our AI
              system. Our goal is to make expert-level fitness advice accessible to everyone, helping users perfect
              their form and avoid injuries, all from the convenience of their own homes or gyms.
            </p>
          </div>
        </div>
      </section>

      {/* Record a Video Section */}
      <section
        id="workoutSection"
        className="workout-section"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-photo/fitness-concept-with-equipment-frame_23-2148531436.jpg)`,
        }}
      >
        <h2>Record a Video</h2>
        <div className="video-container">
          <video ref={videoRef} autoPlay muted className="camera-feed"></video>
          {videoUrl && <video ref={recordedVideoRef} controls src={videoUrl} className="recorded-video"></video>}
        </div>

        <div className="controls">
          <select onChange={handleCameraChange}>
            <option value="">Default Camera</option>
            {/* Add available camera options dynamically */}
          </select>
          <button onClick={startCamera} disabled={isCameraOn}>
            Turn Camera On
          </button>
          <button onClick={stopCamera} disabled={!isCameraOn}>
            Stop Camera
          </button>
          <button onClick={startRecording} disabled={!isCameraOn || isRecording}>
            Start Recording
          </button>
          <button onClick={stopRecording} disabled={!isRecording}>
            Stop Recording
          </button>
        </div>
      </section>

      {/* Progress Tracker Section */}
      <section
        id="progressSection"
        className="progress-section"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-photo/fitness-concept-with-equipment-frame_23-2148531436.jpg)`,
        }}
      >
        <h2>Progress Tracker</h2>
        <div className="progress-container">
          <input type="text" placeholder="Enter Weekly Progress" />
          <input type="text" placeholder="Set Next Week's Goal" />
          <button className="submit-btn">Submit Progress</button>
        </div>
      </section>
    </div>
  );
}

export default App;
