from django.db import models

# Create your models here.

# 오디오 파일을 저장할 모델
class AudioRecording(models.Model):
    uploaded_at=models.DateTimeField(auto_now_add=True)
    audio_file=models.FileField(upload_to='audio_files/') # 파일 저장 경로
    
    def __str__(self):
        return f"Recording {self.id} at {self.uploaded_at}"

class ImageUpload(models.Model):
    image = models.ImageField(upload_to='photo/')  # 업로드할 폴더를 지정 (media/photo 폴더에 저장됨)
    uploaded_at = models.DateTimeField(auto_now_add=True)  # 업로드 시간 자동 설정

    def __str__(self):
        return f"Image uploaded at {self.uploaded_at}"