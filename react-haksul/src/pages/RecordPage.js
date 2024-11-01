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
    
    const [isListening, setIsListening] = useState(false); // 녹음 관련
    const [audioBlobs, setAudioBlobs] = useState([]); // 녹음 관련
    const [fullAudioUrl, setFullAudioUrl] = useState(null); // 녹음 관련
    const [showModal, setShowModal]=useState(false); // 녹음 팝업 모달

    const [showImageUploadModal, setShowImageUploadModal] = useState(false); // 이미지 팝업 모달
    const [selectedImages, setSelectedImages] = useState([]); // 여러 이미지를 저장할 상태

    const [showPDFUploadModal, setShowPDFUploadModal] = useState(false); // PDF 모달 상태
    const [selectedPDFs, setSelectedPDFs] = useState([]); // 선택된 PDF 파일 배열

    const [transcriptions, setTranscriptions] = useState({}); // mp3 to text

    const mediaRecorder = useRef(null); // 녹음 관련
    const audioChunks = useRef([]); // 녹음 관련
    const intervalId = useRef(null); 

    const toggleSidebar = () => {
        setIsSidebarHidden(!isSidebarHidden);
    };

    // toggleSTT 관련 함수들
    const toggleSTT = () => {
        setIsListening((prev) => !prev);
        audioChunks.current=[];
    };

    const createFullAudioBlob = useCallback(() => {
        const completeBlob = new Blob(audioBlobs, { type: 'audio/mp3' });
        const completeAudioUrl = URL.createObjectURL(completeBlob);
        setFullAudioUrl(completeAudioUrl);
        setShowModal(true); // 오디오 생성시 모달 표시
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

                    // mediaRecorder.current.ondataavailable = (event) => {
                    //     audioChunks.current.push(event.data);
                    // };

                    audioChunks.current = []; // 녹음 시작 시 audioChunks 초기화

                    mediaRecorder.current.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                            audioChunks.current.push(event.data);
                            console.log("Data available:", event.data);
                        }
                    };

                    mediaRecorder.current.onstart = () => {
                        console.log("Recording started");
                    };

                    mediaRecorder.current.onstop = () => {
                        console.log("Recording stopped");
                        clearInterval(intervalId.current);
                        saveAudioBlob();
                        createFullAudioBlob();

                        audioChunks.current=[];

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
    
    const closeModal = () =>{
        setShowModal(false);
    }
    // toggleSTT 관련 기능

    const capturePhoto = () => {
        // 사진 촬영 기능 구현
    };

    // 이미지 업로드
    const uploadImage = () => {
        setShowImageUploadModal(true);
    };
    const handleImageSelection = (event) => {
        setSelectedImages([...event.target.files]); // 선택한 파일들을 배열로 저장
    };

    const handleImageUpload = async () => {
        if (selectedImages.length === 0) return;

        const formData = new FormData();
        selectedImages.forEach((image, index) => {
            formData.append(`image_${index}`, image); // 각 이미지 파일을 formData에 추가
        });

        try {
            const response = await fetch('http://localhost:8000/upload-images/', { // Django 백엔드의 엔드포인트
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('이미지가 성공적으로 업로드되었습니다!');
                setSelectedImages([]); // 성공적으로 업로드 후 선택된 이미지 초기화
                setShowImageUploadModal(false); // 업로드 후 모달 닫기
            } else {
                alert('이미지 업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('업로드 오류:', error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    };
    // 이미지 업로드 기능

    // 이미지 OCR
    const handleImageToText = async () => {
        try {
            const response = await fetch('http://localhost:8000/convert-images-to-text/');
            if (response.ok) {
                const data = await response.json();
                setTranscriptions(data.transcriptions); // 변환된 텍스트를 저장
                alert('이미지의 텍스트 변환이 완료되었습니다!');
            } else {
                alert('이미지 텍스트 변환 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error("이미지 변환 요청 중 오류 발생:", error);
            alert('이미지 변환 중 오류가 발생했습니다.');
        }
    };
    // 이미지 OCR

    // PDF 업로드 기능
    const uploadPDF = () => {
        setShowPDFUploadModal(true);
    };
    const handlePDFSelection = (event) => {
        setSelectedPDFs([...event.target.files]); // 선택한 파일을 배열로 저장
    };
    const handlePDFUpload = async () => {
        if (selectedPDFs.length === 0) return;
    
        const formData = new FormData();
        selectedPDFs.forEach((pdf, index) => {
            formData.append(`pdf_${index}`, pdf); // 각 PDF 파일을 formData에 추가
        });
    
        try {
            const response = await fetch('http://localhost:8000/upload-pdfs/', { // Django 엔드포인트
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                alert('PDF 파일이 성공적으로 업로드되었습니다!');
                setSelectedPDFs([]); // 성공적으로 업로드 후 선택된 파일 초기화
                setShowPDFUploadModal(false); // 업로드 후 모달 닫기
            } else {
                alert('PDF 업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('업로드 오류:', error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    };
    // PDF 업로드 기능

    // 녹음본 STT
    const fetchTranscriptions = async () => {
        try {
            const response = await fetch('http://localhost:8000/transcribe-audio/');
            if (response.ok) {
                const data = await response.json();
                setTranscriptions(data.transcriptions);
            } else {
                console.error("텍스트 변환 요청에 실패했습니다.");
            }
        } catch (error) {
            console.error("요청 중 오류 발생:", error);
        }
    };
    // 녹음본 STT

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
                    <button className="translate-button" onClick={fetchTranscriptions}>녹음 변환</button> {/* 녹음 번역 버튼 추가 */}

                    <div className="icon-button" onClick={capturePhoto}>
                        <img src={cameraIcon} alt="촬영" className="icon" />
                        <span className="icon-text">촬영</span>
                    </div>
                    <div className="icon-button" onClick={uploadImage}>
                        <img src={imageIcon} alt="이미지" className="icon" />
                        <span className="icon-text">이미지</span>
                    </div>
                    <button className="translate-button" onClick={handleImageToText}>이미지 변환</button> {/* 이미지 번역 버튼 추가 */}
                    <div className="icon-button" onClick={uploadPDF}>
                        <img src={pdfIcon} alt="PDF" className="icon" />
                        <span className="icon-text">PDF</span>
                    </div>
                    
                </div>

                <div className="main">
                    <div id="widgetDisplay" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.entries(transcriptions).map(([key, value]) => (
                            <div key={key} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>{key}</h4>
                                {typeof value === 'object' && value !== null ? (
                                    <div>
                                        {Object.entries(value).map(([subKey, subValue]) => (
                                            <p key={subKey} style={{ margin: '0.5rem 0' }}>
                                                <strong>{subKey}:</strong> {subValue}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p>{value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        {/* 녹음 팝업창 */}
        {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>전체 녹음:</h3>
                        <audio src={fullAudioUrl} controls />
                        <a href={fullAudioUrl} download="complete_recording.mp3">전체 MP3 파일 다운로드</a>
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            )}
        
        {/* 이미지 팝업창 */}
        {showImageUploadModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowImageUploadModal(false)}>&times;</span>
                        <h3>이미지 업로드</h3>
                        <input type="file" accept="image/*" multiple onChange={handleImageSelection} />
                        {selectedImages.length > 0 && (
                            <p>{selectedImages.length}개의 이미지가 선택되었습니다.</p>
                        )}
                        <button onClick={handleImageUpload}>업로드</button>
                    </div>
                </div>
            )}
        
        {/* pdf 팝업창 */}
        {showPDFUploadModal && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setShowPDFUploadModal(false)}>&times;</span>
                    <h3>PDF 업로드</h3>
                    <input type="file" accept=".pdf" multiple onChange={handlePDFSelection} />
                    {selectedPDFs.length > 0 && (
                        <p>{selectedPDFs.length}개의 PDF가 선택되었습니다.</p>
                    )}
                    <button onClick={handlePDFUpload}>업로드</button>
                </div>
            </div>
        )}

        <div className="footer">
            <p id="status">준비 완료</p>
        </div>
        </div>
    );
}

export default App;