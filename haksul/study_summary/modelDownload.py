import subprocess
import zipfile
import os
import shutil

# 다운로드할 파일 ID와 현재 디렉토리에 저장할 경로 설정
# https://drive.google.com/file/d/18ELOlhRGk0XbXxc6tUb2soe2_pfYhGu2/view?usp=drive_link
file_id = '18ELOlhRGk0XbXxc6tUb2soe2_pfYhGu2'
output_path = './results.zip'  # 현재 디렉토리에 다운로드
extract_folder = './results'  # 압축 해제할 폴더명

# gdown을 사용해 파일 다운로드
subprocess.run(['gdown', f'https://drive.google.com/uc?id={file_id}', '-O', output_path])

# 압축 해제할 폴더 생성
os.makedirs(extract_folder, exist_ok=True)

# 압축 파일을 지정된 폴더 안에 해제
with zipfile.ZipFile(output_path, 'r') as zip_ref:
    zip_ref.extractall(extract_folder)  # 압축 해제 폴더로 설정

# __MACOSX 폴더가 존재할 경우 삭제
macosx_path = os.path.join(extract_folder, '__MACOSX')
if os.path.exists(macosx_path):
    shutil.rmtree(macosx_path)

print(f"Files extracted to: {extract_folder} (without __MACOSX)")