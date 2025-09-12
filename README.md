# 🏥 Patient Workflow Management System 

A full-stack **Patient Workflow Management System** built with **Node.js, Express, Sequelize, PostgreSQL, React (Vite), and Material UI**.  
This platform enables patients to easily search for doctors by specialty or location, view doctor details, and book appointments. Admins can manage doctors, appointments, and patients with a secure backend.  

---

## 🚀 Features  

### 👨‍⚕️ For Patients  
- 🔍 Search doctors by **specialty** or **location** (case-insensitive search with debounce).  
- 📅 Choose available slots with a **date picker (MUI)** and **time slot selection**.  
- 👨‍⚕️ View detailed doctor profiles including **bio, location, specialty, and profile picture**.  
- 📋 Manage personal appointments (view upcoming & past).  

### 🛠️ For Admin  
- ➕ Add, update, or delete doctors with profile pictures.  
- 📂 Manage appointments and patient records.  
- 🗑️ Doctor delete confirmation with **SweetAlert2**.  
- 📷 Automatic file upload handling with proper cleanup of deleted files. 

---

## 🖥️ Tech Stack  

**Frontend**  
- React (Vite)  
- React Router  
- Material UI v5  
- React Toastify  
- SweetAlert2  

**Backend**  
- Node.js  
- Express.js  
- Sequelize ORM  
- PostgreSQL  
- Multer (file upload)   

---

## ⚡ Installation  

### Prerequisites
- Node.js v22.18.0  
- PostgreSQL 17.6 

### Clone the Repository 
```bash
git clone https://github.com/Puneet-kushwaha/patient-workflow-system
```

### Backend Setup  
```bash
cd backend
npm install
cp .env.example .env   # Add your DB config and backend URL here
npm run dev
```

### Frontend Setup  
```bash
cd frontend
npm install
cp .env.example .env   # Add your backend API URL
npm run dev
```

## 🗄️ Database Setup  

This project uses **PostgreSQL** as the database.  
A backup file `patient_workflow_system.backup` is included in: 
backend/patient_workflow_system.backup

### Restore Database in pgAdmin 4
1. Open **pgAdmin 4**.  
2. Right-click on **Databases → Create → Database…**  
   - Name the database: `patient_workflow_system`  
3. Right-click on the new database → **Restore**.  
4. Select the backup file:

## 🔑 Environment Variables  

### Backend (`.env`)
```env
PORT=8000
JWT_SECRET=
JWT_EXPIRES_IN=1d
NODE_ENV=dev|prod
PG_CONNECTION=
```

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📅 Appointment Slot Example  

Available slots include:  
- 10 AM – 11 AM  
- 11 AM – 12 PM  
- 12 PM – 1 PM  
- 2 PM – 3 PM  
- 3 PM – 4 PM  
- 4 PM – 5 PM
- 5 PM – 6 PM
- 6 PM – 7 PM

Users can toggle selection, and re-clicking the same slot will deselect it.  

---

## 🖊️ License  
This project is licensed under the **MIT License**.  
