import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const handleStartRecording = async () => {
    // MediaRecorder로 녹음 시작
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      // 녹음이 중지되면 Blob으로 변환하고 오디오 URL 생성
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunks.current = []; // 초기화
    };

    mediaRecorder.current.start();
    setIsRecording(true);
    };

    const handleStopRecording = () => {
        mediaRecorder.current.stop();
        setIsRecording(false);
    };

    const handleButtonClick = () => {
        if (isRecording) {
        handleStopRecording();
        } else {
        handleStartRecording();
        }
    };

    return (
        <div>
        <button onClick={handleButtonClick}>
            {isRecording ? '종료' : '입력'}
        </button>
        {audioUrl && (
            <div>
            <h3>녹음된 음성:</h3>
            <audio src={audioUrl} controls />
            <a href={audioUrl} download="recording.mp3">
                MP3 파일 다운로드
            </a>
            </div>
        )}
        </div>
    );
};

export default VoiceRecorder;