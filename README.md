# 🚀 CareerHub - Professional Job Portal

> **Connect with your Dream Job. Hire Top Talent.**

CareerHub is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to bridge the gap between job seekers and recruiters. It features a modern, responsive "Glassmorphism" UI, robust authentication, and real-time job management.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Unified Login System**: Secure access for Applicants, Recruiters, and Admins from a single portal.
- **JWT Authentication**: Stateless, secure session management.
- **Password Hashing**: Industry-standard bcrypt security.

### 👨‍💻 For Applicants
- **Smart Dashboard**: View applied jobs and status updates.
- **Advanced Job Search**: Filter by Job Type, Salary, Duration, and real-time search.
- **Profile Management**: Professional profile with **Interactive Skill Tags** and Resume Upload.
- **One-Click Apply**: Streamlined application process.

### 🏢 For Recruiters
- **Job Management**: Create, Edit, and Delete job postings.
- **Applicant Tracking**: View all applications for your jobs.
- **Candidate Review**: Sort, shortlist, and accept/reject applicants.
- **Profile Customization**: Manage company details and bio.

### 🎨 UI/UX
- **Modern Design**: Deep Navy Blue theme with Glassmorphism effects.
- **Responsive**: Fully optimized for Desktop and Mobile.
- **Interactive**: Smooth transitions, hover effects, and dynamic feedback.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios, CSS3 (Custom Variables & Flexbox/Grid).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Utilities**: Multer (File Upload), JSONWebToken (Auth).

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

**Create a `.env` file in the `backend` folder:**
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**Start the Server:**
```bash
npm start
# Server runs on http://localhost:4000
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

**Start the React App:**
```bash
npm start
# App runs on http://localhost:3000
```

---

## 📸 Usage Guide

1.  **Register**: Create an account as an 'Applicant' or 'Recruiter'.
2.  **Login**: Access your dashboard.
3.  **Recruiters**: Post a new job from the dashboard.
4.  **Applicants**: Search for jobs on the home page and click "Apply".
5.  **Manage**: Update profiles and track applications in real-time.

---

## 📄 License

This project is open-source and available for educational purposes.

---
*Built with ❤️ by the CareerHub Team.*
