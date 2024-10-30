from django.urls import path
from . import views

urlpatterns = [
    path('upload-audio/',views.upload_audio, name='upload_audio'),
    path('upload-images/',views.upload_images, name='upload_images'),
    path('transcribe-audio/', views.transcribe_audio_files, name='transcribe_audio_files'),
]