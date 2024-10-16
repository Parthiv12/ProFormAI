import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    });
  }, []);

  const startCamera = () => {
    const constraints = {
      video: {
        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
      },
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      })
      .catch((error) => console.error('Error accessing the camera', error));
  };

  const stopCamera = () => {
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setIsCameraOn(false);
  };

  const startRecording = () => {
    let stream = videoRef.current.srcObject;
    let mediaRecorder = new MediaRecorder(stream);
    let chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = (e) => {
      let blob = new Blob(chunks, { type: 'video/mp4' });
      let videoURL = window.URL.createObjectURL(blob);
      setVideoUrl(videoURL);
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 2000); // record for 2 seconds
  };

  return (
    <div className="App">
      {/* Main Header Section */}
<<<<<<< HEAD
      <header className="main-header" style={{ backgroundImage: `url(https://img.freepik.com/free-photo/modern-gym-interior-with-equipment_1304147-35110.jpg)` }}>
        <nav className="menu">
          <ul>
            <li><button onClick={() => document.getElementById('analyzerSection').scrollIntoView({ behavior: 'smooth' })}>Analyzer</button></li>
            <li><button onClick={() => document.getElementById('workoutScheduleSection').scrollIntoView({ behavior: 'smooth' })}>Workout Schedule</button></li>
            <li><button onClick={() => document.getElementById('aboutSection').scrollIntoView({ behavior: 'smooth' })}>About Us</button></li>
          </ul>
        </nav>
=======
      <header
        className="main-header"
        style={{
          backgroundImage: `url(https://t3.ftcdn.net/jpg/04/29/35/62/360_F_429356296_CVQ5LkC6Pl55kUNLqLisVKgTw9vjyif1.jpg)`,
        }}
      >
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
        <div className="overlay">
          <div className="content-wrapper">
            <h1 style={{ fontSize: '5rem', color: 'white' }}>ProFormAI</h1>
            <p style={{ fontSize: '1.5rem', color: 'white' }}>Enhance your workout form with AI-based analysis.</p>
            <button className="get-started-btn" onClick={() => document.getElementById('analyzerSection').scrollIntoView({ behavior: 'smooth' })}>Get Started</button>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Page 2: Record a Video */}
      <section id="analyzerSection" className="analyzer-section" style={{ backgroundImage: `url(https://img.freepik.com/free-photo/fitness-concept-with-equipment-frame_23-2148531436.jpg)` }}>
        <h2>Record a Video</h2>
        <div className="video-container">
          <video ref={videoRef} autoPlay className="camera-feed"></video>
          <video ref={recordedVideoRef} src={videoUrl} controls className="recorded-video"></video>
        </div>
        <div className="controls">
          <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)}>
            {availableCameras.map(camera => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || 'Default Camera'}
              </option>
            ))}
          </select>
          <button onClick={startCamera} disabled={isCameraOn}>Turn Camera On</button>
          <button onClick={stopCamera} disabled={!isCameraOn}>Stop Camera</button>
          <button onClick={startRecording} disabled={!isCameraOn}>Start Recording</button>
        </div>
      </section>

      {/* Page 3: About Us */}
      <section id="aboutSection" className="about-section" style={{ backgroundImage: `url(https://img.freepik.com/free-photo/modern-gym-interior-with-equipment_1304147-35110.jpg)` }}>
=======
      {/* About Us Section */}
      <section
        id="aboutSection"
        className="about-section"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-photo/fitness-concept-with-equipment-frame_23-2148531436.jpg)`,
        }}
      >
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
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
<<<<<<< HEAD
=======

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
>>>>>>> 3654dfda007a14132494bb50e136f94f24006cc9
    </div>
  );
}

export default App;