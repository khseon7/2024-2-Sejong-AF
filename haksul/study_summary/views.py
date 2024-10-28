from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AudioRecording
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