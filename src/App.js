import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);

  const startCamera = (cameraId) => {
    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: cameraId ? { exact: cameraId } : undefined },
      })
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
    // Check if the camera stream is active
    const stream = videoRef.current?.srcObject;
    
    if (!stream) {
      console.error('No active camera stream found. Please start the camera before recording.');
      return;
    }

    try {
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

      const recordingInterval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      setTimeout(() => clearInterval(recordingInterval), 60000); // Stops the timer after 60 seconds
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
    setRecordingTime(0);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
    });
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      {/* Main Header Section */}
      <header className="main-header" style={{ backgroundImage: `url(https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg)` }}>
        <div className="overlay">
          <div className="content-wrapper">
            <h1 style={{ fontSize: '5rem', color: 'white' }}>ProFormAI</h1>
            <p style={{ fontSize: '1.5rem', color: 'white' }}>
              Enhance your workout form with AI-based analysis.
            </p>
            <button className="get-started-btn" onClick={() => scrollToSection('aboutSection')} style={{ backgroundColor: '#4682B4', color: 'white', borderRadius: '30px' }}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Menu Section */}
      <nav className="top-menu">
        <button onClick={() => scrollToSection('aboutSection')}>About Us</button>
        <button onClick={() => scrollToSection('workoutSection')}>Analyzer</button>
      </nav>

      {/* About Us Section */}
      <section id="aboutSection" className="about-section" style={{ backgroundImage: `url(https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg)` }}>
        <div className="about-container">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              ProFormAI was created with a mission to revolutionize how fitness enthusiasts approach their workouts.
              Our web app allows users to record themselves performing specific exercises, compare their form to professional 
              standards, and receive feedback and recommendations on areas for improvement from our AI system.
              Our goal is to make expert-level fitness advice accessible to everyone, helping users perfect their form 
              and avoid injuries, all from the convenience of their own homes or gyms.
            </p>
          </div>
        </div>
      </section>

      {/* Workout Section */}
      <section id="workoutSection" className="workout-section">
        <h2>Record a Video</h2>
        <div className="video-container">
          <div>
            <video ref={videoRef} autoPlay muted className="camera-feed"></video>
          </div>
          <div>
            <video ref={recordedVideoRef} controls src={videoUrl} className="recorded-video"></video>
          </div>
        </div>
        <div>
          <label>Choose Camera:</label>
          <select onChange={(e) => startCamera(e.target.value)} value={selectedCamera}>
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          {!isRecording && <button onClick={startRecording} className="record-btn">Start Recording</button>}
          {isRecording && <button onClick={stopRecording} className="record-btn">Stop Recording ({recordingTime}s)</button>}
          <button onClick={stopCamera} className="stop-camera-btn">Stop Camera</button>
        </div>
      </section>
    </div>
  );
}

export default App;
