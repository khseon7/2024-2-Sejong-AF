import subprocess

# Django 앱 경로로 이동하여 runserver 실행
subprocess.Popen(['python', 'manage.py', 'runserver'], cwd='haksul')
# React 앱 경로로 이동하여 npm start 실행
subprocess.Popen(['npm', 'start'], cwd='react-haksul')


