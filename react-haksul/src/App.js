import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Record from './pages/RecordPage';

function App() {
  useEffect(() => {
    document.title = '학습나래';
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* 메인 페이지 라우트 */}
            <Route path="/" element={<MainPage />} />

            {/* 녹음 페이지 라우트 */}
            <Route path="/record" element={<Record />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
