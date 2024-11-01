# 2024-2-Sejong-AF(Academic Festival)
2024년도 2학기 세종대학교 소프트웨어융합대학 학술제

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/eba01c04-2325-49bb-9778-e375ecf59cfa">

## 사용법
1. `git clone https://github.com/khseon7/2024-2-Sejong-AF.git`
2. `cd 2024-2-Sejong-AF` (클론한 폴더에 접속)
3. `pip install -r requirements.txt` (pip가 안될경우 파이썬부터 다운)
4. `cd haksul/study_summary` (요약, 번역 모델을 저장할 위치로 이동)
5. `python modelsDownload.py` (요약, 번역 모델 다운로드 6분 정도 소요)
6. `cd ..`, `cd ..` (2024-2-Sejong-AF파일로 돌아갑니다.)
7. `cd react-haksul/`후 `npm install`
8. `cd ..` (2024-2-Sejong-AF파일로 돌아갑니다.)
9. `python start_both.py` (React와 Django 서버를 동시에 실행합니다.)

서버 실행하기 전 구글 폼으로 제출한 `secret.json`을 `2024-2-Sejong-AF/haksul/`에 추가한 후 실행하면 됩니다.

음원 녹음하기전 초기화 버튼을 누르고 진행하셔야 합니다
음원 부분은 아직 문재 해결이 되지 않아 음성 녹음이 끝나고 팝업이 나온후 `업로드` 버튼을 누르면 됩니다.

<div align="center">
  <h3>📖기술 스택📖</h3>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
</div>
