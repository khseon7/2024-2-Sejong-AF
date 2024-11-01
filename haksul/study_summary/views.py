import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AudioRecording, ImageUpload, PDFUpload
from .all_class import WhisperSTT, myOCR, myT5

# Create your views here.
@csrf_exempt
def upload_audio(request):
    if request.method=='POST':
        audio_file=request.FILES.get('audio_file')

        if audio_file:
            recording=AudioRecording(audio_file=audio_file)
            recording.save()
            return JsonResponse({'message':'File uploaded successfully'}, status=200)
        else:
            return JsonResponse({'message':'No file provided'}, status=400)
    return JsonResponse({'error':'Invalid request'},status=400)

@csrf_exempt
def upload_images(request):
    if request.method == 'POST':
        images = request.FILES  # 업로드된 파일들을 가져옴
        saved_files = []

        for key, image in images.items():
            # media/photo 폴더에 이미지 저장
            saved_file = ImageUpload.objects.create(image=image)
            saved_files.append(saved_file.image.url)  # 저장된 파일의 URL 저장

        return JsonResponse({'message': '이미지 업로드 성공', 'files': saved_files})
    return JsonResponse({'error': '잘못된 요청입니다'}, status=400)

@csrf_exempt
def upload_pdfs(request):
    if request.method == 'POST':
        pdf_files = request.FILES.items()  # 여러 PDF 파일을 가져옴
        saved_files = []

        # media/pdf 폴더가 없으면 생성
        pdf_folder = os.path.join(settings.MEDIA_ROOT, 'pdf')
        os.makedirs(pdf_folder, exist_ok=True)

        for key, pdf_file in pdf_files:  # 각 파일을 key, pdf_file로 분리
            # 파일 확장자가 .pdf인지 확인
            if pdf_file.name.lower().endswith('.pdf'):
                # PDF 파일을 PDFUpload 모델에 저장
                saved_file = PDFUpload.objects.create(pdf_file=pdf_file)
                saved_files.append(saved_file.pdf_file.url)  # 저장된 파일의 URL 저장
            else:
                print(f"잘못된 파일 형식: {pdf_file.name}")

        if saved_files:
            return JsonResponse({'message': 'PDF 파일 업로드 성공', 'files': saved_files})
        else:
            return JsonResponse({'error': 'PDF 파일만 업로드할 수 있습니다.'}, status=400)
        
    return JsonResponse({'error': '잘못된 요청입니다'}, status=400)

def transcribe_audio_files(request):
    audio_dir=os.path.join(settings.MEDIA_ROOT,'audio_files')
    transcriptions={}
    whisper_stt=WhisperSTT()
    t=myT5("study_summary/results/results/checkpoint-840")
    
    for filename in os.listdir(audio_dir):
        
        if filename.endswith('.mp3'):
            file_path=os.path.join(audio_dir,filename)
            transcription = whisper_stt.transcribe(file_path)
            print(transcription)
            # transcriptions[filename]=transcription
            transcriptions[filename]=t.predict(transcription)
    return JsonResponse({'transcriptions':transcriptions})

def convert_images_to_text(request):
    photo_dir=os.path.join(settings.MEDIA_ROOT,'photo')
    transcriptions={}
    t=myT5("study_summary/results/results/checkpoint-1800")
    
    for filename in os.listdir(photo_dir):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            image_path = os.path.join(photo_dir, filename)
            ocr_result = myOCR().predict(image_path)  # MyOCR 클래스를 사용한 텍스트 변환
            transcriptions[filename] = t.predict(ocr_result)

    return JsonResponse({'transcriptions': transcriptions})