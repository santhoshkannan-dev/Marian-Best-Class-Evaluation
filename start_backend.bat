@echo off
echo Starting Django Backend Server...
cd backend
call venv\Scripts\activate
python manage.py runserver 8000
