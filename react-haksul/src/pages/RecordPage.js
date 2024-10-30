import React, { useState, useRef, useEffect, useCallback } from 'react'; // 녹음을 위해 추가한 useRef, useEffect, useCallback
import './RecordPage.css';
import kkirrukImage from './KKIrruk.jpg';
import sejongImage from './sejong.png';
import cameraIcon from './camera-icon.png';
import microphoneIcon from './microphone-icon.png';
import pdfIcon from './pdf-icon.png';
import imageIcon from './image-icon.png';

function App() {
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    // 음향 다운 받기 위함
    const [isListening, setIsListening] = useState(false);
    const [audioBlobs, setAudioBlobs] = useState([]);
    const [fullAudioUrl, setFullAudioUrl] = useState(null);
    
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const intervalId = useRef(null);
    // 음향 다운 받기 위함

    const toggleSidebar = () => {
        setIsSidebarHidden(!isSidebarHidden);
    };

    // toggleSTT 관련 함수들
    const toggleSTT = () => {
        setIsListening((prev) => !prev);
    };

    const createFullAudioBlob = useCallback(() => {
        const completeBlob = new Blob(audioBlobs, { type: 'audio/mp3' });
        const completeAudioUrl = URL.createObjectURL(completeBlob);
        setFullAudioUrl(completeAudioUrl);
    }, [audioBlobs]);

    useEffect(() => {
        const statusElement = document.getElementById("status");
        if (statusElement) {
            statusElement.innerText = isListening ? "음성 인식 시작" : "음성 인식 완료";
        }

        const handleRecording = async () => {
            if (isListening) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder.current = new MediaRecorder(stream);

                    mediaRecorder.current.ondataavailable = (event) => {
                        audioChunks.current.push(event.data);
                    };

                    mediaRecorder.current.onstart = () => {
                        console.log("Recording started");
                    };

                    mediaRecorder.current.onstop = () => {
                        console.log("Recording stopped");
                        clearInterval(intervalId.current);
                        saveAudioBlob();
                        createFullAudioBlob();
                        stream.getTracks().forEach((track) => track.stop()); // Stop all audio tracks
                    };

                    mediaRecorder.current.start();
                    intervalId.current = setInterval(saveAudioBlob, 600000); // 10분마다 블록 저장
                } catch (error) {
                    console.error('Error accessing audio device:', error);
                }
            } else if (mediaRecorder.current) {
                mediaRecorder.current.stop();
            }
        };

        handleRecording();

        return () => {
            if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
                mediaRecorder.current.stop();
            }
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
    }, [isListening, createFullAudioBlob]);

    const saveAudioBlob = () => {
        if (audioChunks.current.length > 0) {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
            setAudioBlobs((prevBlobs) => [...prevBlobs, audioBlob]);
            audioChunks.current = [];
        }
    };

    const handleUpload = async () => {
        if (audioBlobs.length === 0) return;

        try {
            for (let i = 0; i < audioBlobs.length; i++) {
                const formData = new FormData();
                formData.append('audio_file', audioBlobs[i], `recording_part_${i + 1}.mp3`);

                const response = await fetch('http://localhost:8000/upload-audio/', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log(`파일 업로드 성공: recording_part_${i + 1}.mp3`);
                } else {
                    console.log(`파일 업로드 실패: recording_part_${i + 1}.mp3`);
                }
            }
            alert('모든 파일이 성공적으로 업로드되었습니다!');
        } catch (error) {
            console.error('업로드 오류:', error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    };
    // toggleSTT 관련 기능


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

        {fullAudioUrl && (
                <div>
                    <h3>전체 녹음:</h3>
                    <audio src={fullAudioUrl} controls />
                    <a href={fullAudioUrl} download="complete_recording.mp3">전체 MP3 파일 다운로드</a>
                    <button onClick={handleUpload}>Upload</button>
                </div>
            )}

        <div className="footer">
            <p id="status">준비 완료</p>
        </div>
        </div>
    );
}

export default App;