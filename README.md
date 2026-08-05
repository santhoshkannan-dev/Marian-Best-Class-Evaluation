# Excellence Grid — Marian Best Class Evaluation System

A comprehensive, full-stack platform designed for **Marian College Kuttikkanam (Autonomous)** to evaluate, score, and rank departmental classes across Academic, Co-Curricular, and Extra-Curricular criteria.

---

## 📋 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Clone & Workspace Setup](#1-clone--workspace-setup)
  - [2. Backend Setup (Django REST Framework)](#2-backend-setup-django-rest-framework)
  - [3. Database Seeding](#3-database-seeding)
  - [4. Frontend Setup (Next.js)](#4-frontend-setup-nextjs)
- [Bash Scripts & Automation](#-bash-scripts--automation)
- [User Roles & Access Portals](#-user-roles--access-portals)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture Overview

The system is built as a modern decoupled full-stack application:

- **Frontend**: Next.js 14 (App Router), React, Vanilla CSS design system, Responsive UI layout with Google OAuth support.
- **Backend**: Django 5.x / 6.x REST Framework (DRF), SQLite 3NF relational database architecture with automated audit trail logging and multi-criteria evaluation indices.
- **Authentication**: JWT & Dev Bypass Login with Marian College email series auto-detection (`@mariancollege.org`).

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or `v20.x` higher ([Download Node.js](https://nodejs.org/))
- **Python**: `v3.10.x` or `v3.12.x` ([Download Python](https://www.python.org/))
- **Git**: Latest version ([Download Git](https://git-scm.com/))
- **PowerShell / Bash**: Windows PowerShell or standard Bash terminal.

---

## ⚙️ Environment Configuration

### Backend Environment Variables (`backend/.env`)

Create a `.env` file in the `backend/` directory if custom secrets are required:

```env
SECRET_KEY=django-insecure-marian-best-class-key-2026
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend Environment Variables (`.env.local`)

Create `.env.local` in the project root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🚀 Quick Start Guide

### 1. Clone & Workspace Setup

```bash
git clone https://github.com/santhoshkannan-dev/Marian-Best-Class-Evaluation.git
cd Marian-Best-Class-Evaluation
```

---

### 2. Backend Setup (Django REST Framework)

Navigate to the `backend` folder, set up a Python virtual environment, install dependencies, and run database migrations:

#### On Windows (PowerShell / Command Prompt):

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install required dependencies
pip install -r requirements.txt

# Run Database Migrations
python manage.py makemigrations users
python manage.py migrate
```

#### On Linux / macOS (Bash):

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Run Database Migrations
python manage.py makemigrations users
python manage.py migrate
```

---

### 3. Database Seeding

Seed default Academic Years, Departments, Classes, User Groups, and Criteria Catalog items into the SQLite database:

```bash
# Ensure virtual environment is active inside backend/ folder
python manage.py seed_users
```

#### Create Django Superuser (Admin Portal Access)

```bash
python manage.py createsuperuser --email admin@mariancollege.org --username admin
```

#### Start Backend Development Server

```bash
python manage.py runserver 8000
```

*The backend server will run on `http://127.0.0.1:8000/`.*

---

### 4. Frontend Setup (Next.js)

Open a new terminal window in the root directory of the project:

```bash
# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```

*The frontend application will be accessible at `http://localhost:3000/`.*

---

## 📜 Bash Scripts & Automation

Helper scripts are provided for starting both servers concurrently.

### Run Backend (`start_backend.bat` / `start_backend.sh`)

#### `start_backend.bat` (Windows):
```bat
@echo off
cd backend
call venv\Scripts\activate
python manage.py runserver 8000
```

#### `start_backend.sh` (Linux/macOS):
```bash
#!/bin/bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

### Run Frontend (`start_frontend.bat` / `start_frontend.sh`)

#### `start_frontend.bat` (Windows):
```bat
@echo off
npm run dev
```

#### `start_frontend.sh` (Linux/macOS):
```bash
#!/bin/bash
npm run dev
```

---

## 🔑 User Roles & Access Portals

| Role | Access URL | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Student** | `http://localhost:3000/student/dashboard` | View class criteria, draft academic submissions, view status |
| **Student Rep** | `http://localhost:3000/student/submissions` | Submit grade breakdowns (S, A+, A, Fail, Pass %), verify class items |
| **Class Advisor** | `http://localhost:3000/teacher/dashboard` | Verify student submissions, approve/request corrections |
| **Evaluator** | `http://localhost:3000/evaluator/dashboard` | Evaluate & mark submitted criteria, locked verification |
| **Admin UI** | `http://localhost:3000/admin/academic-years` | Manage departments, classes, academic years, active sessions |
| **Django Admin** | `http://localhost:8000/admin/` | Direct database management, system administration, superuser control |

---

## ❓ Troubleshooting

### 1. `OperationalError: no such table` or missing column error
Re-run migrations and seed command:
```bash
cd backend
python manage.py makemigrations users
python manage.py migrate
python manage.py seed_users
```

### 2. Next.js Build / Type cache error
If `.next` build cache gets out of sync:
```bash
# Windows
cmd /c "rmdir /s /q .next && npm run build"

# Linux / macOS
rm -rf .next && npm run build
```

### 3. Faculty / Student Rep dropdowns empty in Admin
Ensure faculty users have role `faculty` or `teacher` and students belong to the class or email series (`25pmc` for MCA, `25ubc` for BCA). Selecting any eligible candidate automatically populates group membership.

---

## 📄 License

Developed for **Marian College Kuttikkanam (Autonomous)**. All rights reserved.