import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlobs, setAudioBlobs]=useState([]); // 10분 간격의 녹음 Blob을 저장할 목록
    const [fullAudioUrl, setfullAudioUrl]=useState(null); // 전체 녹음 URL
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]); // 현재 녹음 중 데이터 일시적 저장하는 배열
    const intervalId = useRef(null); // 타이머 id 저장

    // 10분마다 Blob 저장 함수
    const saveAudioBlob = () => {
        const audioBlob=new Blob(audioChunks.current, {type: 'audio/mp3'}); // 현재 녹음 데이터 type mp3로 설정
        setAudioBlobs((prevBlobs) => [...prevBlobs, audioBlob]); // 위에서 저장된 Blob을 audioBlobs 배열 마지막에 추가
        audioChunks.current=[]; // audioChunk 초기화
};

    const handleStartRecording = async () => {
    // MediaRecorder로 녹음 시작
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 음성 접근 허용 확인
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
        clearInterval(intervalId.current); // 녹음 종료 시 10분 타이머 종료
        saveAudioBlob(); // 마지막 녹음 저장
        createFullAudioBlob(); // 전체 오디오 병합
    };

    mediaRecorder.current.start();
    setIsRecording(true);

    // 10분마다 saveAudioBlob 호출(10분 = 600000 ms)
    intervalId.current = setInterval(saveAudioBlob, 600000);
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

    const createFullAudioBlob = () => {
        // 각 Blob을 병합해 하나의 전체 Blob 생성
        const completeBlob = new Blob(audioBlobs, {type:'audio/mp3'});
        const completeAudioUrl = URL.createObjectURL(completeBlob);
        setfullAudioUrl(completeAudioUrl); // 전체 오디오 URL 설정
    };

    const handleUpload = async () => {
        if(audioBlobs.length===0) return;
        try {
            for(let i=0;i<audioBlobs.length;i++){
                const formData=new FormData();
                formData.append('audio_file',audioBlobs[i],`recording_part_${i+1}.mp3`);

                const response = await fetch('http://localhost:8000/upload-audio/',{
                    method : 'POST',
                    body : formData,
                });

                if(response.ok){
                    console.log(`파일 업로드 성공 : recording_part_${i+1}.mp3`);
                } else{
                    console.log(`파일 업로드 실패 : recording_part_${i+1}.mp3`);
                }
            }
            alert('모든 파일이 성공적으로 업로드되었습니다!');
        } catch(error){
            console.error('업로드 오류 : ',error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    };
    
    useEffect(() => {
        // VoiceRecorder 컴포넌트가 끝나면(=컴포넌트 언마운트) interval 제거
        return () => {
            if (isRecording) handleStopRecording();
            if (intervalId.current) clearInterval(intervalId.current);
        };
    }, [isRecording]);

    return (
        <div>
        <button onClick={handleButtonClick}>
            {isRecording ? '종료' : '입력'}
        </button>
        {fullAudioUrl && (
            <div>
            <h3>전체 녹음:</h3>
            <audio src={fullAudioUrl} controls />
            <a href={fullAudioUrl} download="complete_recording.mp3">
                전체 MP3 파일 다운로드
            </a>
            <button onClick={handleUpload}>Upload</button> {/* 업로드 버튼 */}
            </div>
        )}
        </div>
    );
};

export default VoiceRecorder;