#!/bin/bash
echo "Starting Django Backend Server..."
cd backend
source venv/bin/activate
python manage.py runserver 8000
