import whisper
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

class WhisperSTT:
    def __init__(self, model_name="base"):
        """
        Whisper 모델을 초기화합니다.
        :param model_name: 사용할 Whisper 모델 이름 ("tiny", "base", "small", "medium", "large" 등).
        """
        self.model = whisper.load_model(model_name)

    def transcribe(self, audio_file_path):
        """
        오디오 파일을 텍스트로 변환합니다.
        :param audio_file_path: 오디오 파일의 경로.
        :return: 텍스트 변환 결과.
        """
        result = self.model.transcribe(audio_file_path)
        return result["text"]
    
    # 사용 예시
    # stt = WhisperSTT(model_name="base")
    # transcription = stt.transcribe("hihi.mp3")
    # print(transcription)
