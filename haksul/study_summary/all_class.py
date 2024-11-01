import whisper, ssl, cv2
from easyocr import Reader
from transformers import T5Tokenizer, T5ForConditionalGeneration

from django.conf import settings
import os

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

class myOCR:
    def __init__(self, langs=['ko', 'en']):
            myOCR.reader = Reader(lang_list=langs, gpu=False)

    def predict(self, image):
        preprocessed_image = cv2.imread(image)
        results = myOCR.reader.readtext(preprocessed_image)
        
        extracted_text = ""
        for (bbox, text, prob) in results:
            print(f"[INFO] {prob:.4f}: {text}")
            extracted_text += text + "\n"
        
        return extracted_text
    
    # 사용 예시
    # image = ImageURL
    # ocr_model = myOCR()
    # extracted_text = ocr_model.predict(image)
    # print("\n추출된 텍스트:\n", extracted_text)

class myT5:
    def __init__(self, modelpath):
        model_dir = os.path.join(settings.BASE_DIR, modelpath)
        self.loadmodel = T5ForConditionalGeneration.from_pretrained(modelpath)
        self.tokenizer = T5Tokenizer.from_pretrained('digit82/kolang-t5-base')

    def predict(self, text):
        tokens = self.tokenizer.encode(text)
        num_tokens = len(tokens)
        print(f"\033[92m{num_tokens}\033[0m") 
        inputs = self.tokenizer.encode(text, return_tensors="pt", max_length=512, truncation=True)
        summary_ids = self.loadmodel.generate(inputs, max_length=150, num_beams=2, early_stopping=True)

        # 수정된 부분: 첫 번째 결과만 디코딩
        summary_predicted = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary_predicted
    
    # 실행 예시
    # n = "Today, let's observe the short agenda as shown on this slide."
    # t = classT5.myT5("results/checkpoint-840")
    # print("check")
    # result = t.predict(n)
    # print(f"\033[92m{n}\033[0m") 
    # print("Trans")
    # print(f"\033[92m{result}\033[0m") 