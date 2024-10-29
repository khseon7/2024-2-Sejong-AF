import React, { useState } from 'react';
import './RecordPage.css';
import kkirrukImage from './KKIrruk.jpg';
import sejongImage from './sejong.png';
import cameraIcon from './camera-icon.png';
import microphoneIcon from './microphone-icon.png';
import pdfIcon from './pdf-icon.png';
import imageIcon from './image-icon.png';

function App() {
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarHidden(!isSidebarHidden);
    };

    const toggleSTT = () => {
        setIsListening(!isListening);
        document.getElementById("status").innerText = isListening ? "음성 인식 완료" : "음성 인식 시작";
    };

    const capturePhoto = () => {
        // 사진 촬영 기능 구현
    };

    const uploadImage = () => {
        // 이미지 업로드 기능 구현
    };

    const uploadPDF = () => {
        // PDF 업로드 기능 구현
    };

    return (
        <div className="app">
        <div className="header">
            <div className="logo-react">
                <img src={sejongImage} alt="로고" className="logo-circle"></img>
            </div>
            <div className="project-name">학습 나래</div>
            <div className="profile">
                <div className="profile-circle">
                    <img src={kkirrukImage} alt="프로필 이미지" className="profile-image" />
                </div>
            <span className="profile-name">KKirruk</span>
            </div>
        </div>

        <div className="container_app">
            <div className={`sidebar ${isSidebarHidden ? 'hidden' : ''}`}>
            <button className="toggle-sidebar" onClick={toggleSidebar}>X</button>
            <h3>번역 및 요약</h3>
            <ul id="translationSummaryList">
                {/* 번역 및 요약 항목들이 여기 추가됩니다 */}
            </ul>
            </div>

            <button
            className={`toggle-sidebar hidden-toggle ${isSidebarHidden ? '' : 'display-none'}`}
            onClick={toggleSidebar}
            >
            X
            </button>

            <div className="content" style={{ width: isSidebarHidden ? '100%' : '85%' }}>
            <div className="icon-bar">
                <div className="icon-button" onClick={toggleSTT}>
                <img src={microphoneIcon} alt="음성" className="icon" />
                <span className="icon-text">음성</span>
                </div>
                <div className="icon-button" onClick={capturePhoto}>
                <img src={cameraIcon} alt="촬영" className="icon" />
                <span className="icon-text">촬영</span>
                </div>
                <div className="icon-button" onClick={uploadImage}>
                <img src={imageIcon} alt="이미지" className="icon" />
                <span className="icon-text">이미지</span>
                </div>
                <div className="icon-button" onClick={uploadPDF}>
                <img src={pdfIcon} alt="PDF" className="icon" />
                <span className="icon-text">PDF</span>
                </div>
            </div>
            <div className="main">
                <div id="widgetDisplay">여기에 번역 , 요약 나옴</div>
            </div>
            </div>
        </div>

        <div className="footer">
            <p id="status">준비 완료</p>
        </div>
        </div>
    );
}

export default App;
