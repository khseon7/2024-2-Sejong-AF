from django.db import models

# Create your models here.

# 오디오 파일을 저장할 모델
class AudioRecording(models.Model):
    uploaded_at=models.DateTimeField(auto_now_add=True)
    audio_file=models.FileField(upload_to='audio_files/') # 파일 저장 경로
    
    def __str__(self):
        return f"Recording {self.id} at {self.uploaded_at}"