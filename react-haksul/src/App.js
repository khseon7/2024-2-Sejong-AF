import './App.css';
import React, { useEffect } from 'react';
import VoiceRecorder from './VoiceRecorder';

function App() {
  useEffect(()=>{
    document.title='슬기샘';
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>음성 녹음 앱</h1>
          <VoiceRecorder />
        </div>
      </header>
    </div>
  );
}

export default App;
