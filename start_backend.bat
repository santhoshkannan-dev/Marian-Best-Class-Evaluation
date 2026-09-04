@echo off
echo Starting Django Backend Server...
cd backend
if exist venv\Scripts\activate.bat call venv\Scripts\activate
python manage.py runserver 8000
