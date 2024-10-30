# 2024-2-Sejong-AF(Academic Festival)
2024년도 2학기 세종대학교 소프트웨어융합대학 학술제
## 사용법
1. 먼저 `git clone https://github.com/khseon7/2024-2-Sejong-AF.git`을 실행해서 받아온다.
2. 시크릿키가 사용자 본인에게 있다는 가정한다.
3. `subprocess` 모듈을 사용하여서 터미널에서 `python start_both.py`를 실행하여 Django와 React를 전부 실행한다.
4. 3.을 실행했을 때 아래와 같은 화면이 나오면 성공!
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/eba01c04-2325-49bb-9778-e375ecf59cfa">
## 앞으로 구현해야 할 것들

- 현재 처음 녹음하는 음성이 출력이 안되어서 그거 조정해야 할 듯
- 음성에 STT 클래스 받아와서 텍스트로 변환 및 출력 기능
- 저장된 이미지에서 OCR 적용하여 텍스트로 변환 및 출력 기능
