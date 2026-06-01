# 🚀 LeetCode Analytics AI

An AI-powered developer analytics platform that combines LeetCode performance tracking, GitHub insights, personalized DSA roadmaps, contest analytics, AI mentorship, and problem recommendations into a unified dashboard.

---

## 📌 Overview

LeetCode Analytics AI helps developers understand their coding journey through data-driven insights and AI-powered guidance.

The platform analyzes LeetCode performance across topics and difficulty levels, identifies strengths and weaknesses, generates personalized study plans, recommends problems for improvement, and provides AI mentorship tailored to the user's profile.

---

## ✨ Features

### 🔐 Authentication & User Management

* JWT Authentication
* User Registration & Login
* Profile Management
* Edit LeetCode Username
* Edit GitHub Username
* Protected Routes

---

### 📊 LeetCode Analytics

* LeetCode GraphQL Integration
* Global Ranking Tracking
* Total Solved Problems
* Easy / Medium / Hard Statistics
* Topic-wise Analysis
* Strong Topic Detection
* Weak Topic Detection
* Analytics Refresh Support

---

### 🤖 AI Mentor

Ask personalized questions such as:

* Why am I weak in Dynamic Programming?
* What should I focus on this month?
* Am I ready for interviews?
* How do I improve Graph Theory?

The mentor uses:

* Ranking
* Solved Count
* Topic Analytics
* Strong Topics
* Weak Topics

to generate context-aware guidance.

---

### 🗺️ AI Roadmap Generator

Generate personalized preparation plans based on:

* Current Ranking
* Solved Problems
* Weak Topics
* Strong Topics
* Career Goals

Features:

* 4-Week AI Roadmaps
* Topic-Based Planning
* Daily Goals
* Difficulty Progression
* Interview Preparation Advice

---

### 📚 Roadmap History

Store and revisit previously generated roadmaps.

Track:

* Goal
* Ranking Snapshot
* Topic Snapshot
* Generation Date

---

### 🎯 Problem Recommendation Engine

Generate personalized LeetCode recommendations based on:

* Weak Topics
* Strong Topics
* Current Progress

Each recommendation includes:

* Problem Title
* Difficulty
* Topic
* Recommendation Reason
* Direct LeetCode URL

---

### 🏆 Contest Analytics

Analyze contest performance through:

* Contest History
* Rank Trends
* Best Performance
* Average Rank
* Historical Contest Statistics

---

### 🐙 GitHub Analytics

Fetch GitHub insights using the user's GitHub username.

Display:

* Profile Summary
* Repository Statistics
* Stars & Forks
* Language Usage
* Developer Activity

---

### 📈 Interactive Dashboard

Visualize coding performance using:

* Topic Analytics Charts
* Difficulty Distribution
* Strong Topic Cards
* Weak Topic Cards
* User Statistics
* Quick Actions

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Recharts

### Backend

* Django
* Django REST Framework
* JWT Authentication

### Database

* PostgreSQL (Neon)

### AI

* Groq API
* Llama Models

### External APIs

* LeetCode GraphQL API
* GitHub REST API

---

## 🏗️ Project Architecture

```text
Frontend (React.js)
        │
        ▼
Django REST APIs
        │
        ▼
PostgreSQL (Neon)
        │
        ├── User Profiles
        ├── Analytics
        ├── Roadmaps
        ├── Contest Data
        └── Recommendations
        │
        ▼
External Services
        ├── LeetCode GraphQL API
        ├── GitHub API
        └── Groq LLM
```

---

## 📂 Project Structure

```text
leetcode-analytics-ai/
│
├── backend/
│   ├── analytics/
│   ├── users/
│   ├── roadmap_ai/
│   ├── contests/
│   ├── recommendations/
│   ├── github_summary/
│   ├── core/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── context/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/LeetCode-AI-Analytics.git

cd LeetCode-AI-Analytics
```

---

## Backend Setup

### Navigate to Backend

```bash
cd backend
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create:

```text
backend/.env
```

Example:

```env
SECRET_KEY=your_secret_key

DATABASE_URL=your_neon_postgresql_connection_string

GROQ_API_KEY=your_groq_api_key
```

### Apply Migrations

```bash
python manage.py makemigrations

python manage.py migrate
```

### Run Backend

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

```http
POST /api/users/register/
POST /api/token/
POST /api/token/refresh/
```

### User

```http
GET /api/users/me/
PUT /api/users/profile/
```

### Analytics

```http
POST /api/analytics/sync/
GET /api/analytics/dashboard/

POST /api/analytics/topics/sync/
GET /api/analytics/topics/
GET /api/analytics/topics/strong/
GET /api/analytics/topics/weak/
```

### Roadmaps

```http
POST /api/roadmap/generate/
GET /api/roadmap/history/
```

### AI Mentor

```http
POST /api/mentor/chat/
```

### Recommendations

```http
GET /api/recommendations/
```

### GitHub Summary

```http
GET /api/github/summary/
```

### Contest Analytics

```http
GET /api/contests/
```

---

## 🎯 Key Highlights

* Tracks performance across 30+ DSA topics.
* Generates AI-powered 4-week preparation roadmaps.
* Provides personalized AI mentorship.
* Recommends LeetCode problems with direct URLs.
* Combines LeetCode and GitHub analytics in a single dashboard.
* Supports contest performance tracking and trend analysis.
* Uses PostgreSQL and JWT Authentication for scalable user management.

---

## 🚀 Future Enhancements

* AI Mock Interviews
* Company-Specific Preparation Paths
* Coding Heatmaps
* Progress Forecasting
* Multi-Platform Coding Analytics
* Study Groups & Collaboration

---

## 👨‍💻 Author

**Ayush Metkar**

GitHub:
https://github.com/ayush-m1911

