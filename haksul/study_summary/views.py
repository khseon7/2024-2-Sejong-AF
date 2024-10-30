import os
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AudioRecording, ImageUpload
from .all_class import WhisperSTT

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

def transcribe_audio_files(request):
    audio_dir=os.path.join(settings.MEDIA_ROOT,'audio_files')
    transcriptions={}
    whisper_stt=WhisperSTT()
    
    for filename in os.listdir(audio_dir):
        if filename.endswith('.mp3'):
            file_path=os.path.join(audio_dir,filename)
            transcription = whisper_stt.transcribe(file_path)
            transcriptions[filename]=transcription
    return JsonResponse({'transcriptions':transcriptions})