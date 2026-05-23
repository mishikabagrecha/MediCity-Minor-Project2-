# 🏥 MediCity - AI-Powered Healthcare Platform

A modern healthcare platform built with React (Vite) and Node.js/Express backend, featuring AI-powered diagnosis, symptom triage, emergency SOS alerts, blood bank finder, and more.

## 🚀 Features

- **AI-Powered Diagnosis** - Upload medical images or describe symptoms to get AI-driven diagnostic assistance across multiple specialties:
  - Chest X-ray Analysis (Pneumonia, Atelectasis, Cardiomegaly, Effusion, Emphysema)
  - OCT Retinal Scan Analysis (CNV, DME, Drusen)
  - Retina Fundus Analysis (Diabetic Retinopathy, Glaucoma, Cataract)
  - Dermatoscopic Analysis (Melanoma, BCC, Actinic Keratosis)
  - General Health Assessment (Thyroid, Anemia, UTI)
- **Symptom Triage** - Describe your symptoms and get preliminary guidance on which specialist to consult
- **Emergency SOS** - Send emergency alerts with your location to registered contacts via SMS (Twilio)
- **Blood Bank Finder** - Find nearby blood banks and donors
- **Exercise & Wellness** - Track health metrics and get AI-powered exercise recommendations
- **Consultation Booking** - Schedule and manage medical consultations
- **Government Schemes** - Information about healthcare schemes and benefits

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 + Vite 8 | Node.js + Express 5 |
| React Router v7 | CORS |
| Tailwind CSS v4 | Body Parser |
| Framer Motion | dotenv |
| Recharts | Twilio API |
| React Leaflet | |
| Three.js / React Three Fiber | |
| TanStack React Query | |
| Lucide Icons | |

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mishikabagrecha/MediCity-Minor-Project2-.git
cd MediCity-Minor-Project2-
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm init -y  # if package.json doesn't exist
npm install express cors body-parser dotenv twilio
cd ..
```

> **Note:** The main `node_modules` from `npm install` in the root already includes most backend packages (express, cors, body-parser, dotenv, twilio). If you encounter missing module errors, run `npm install <package-name>` for the missing dependency.

### 4. Configure Environment Variables

Create/edit the `backend/.env` file:

```env
# MediBridge India Backend Configuration

PORT=5001

# MongoDB (optional - for future features)
MONGO_URI=mongodb://localhost:27017/medicity

# Twilio Programmable Communications (optional - for SOS alerts)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

> Twilio credentials are optional. Without them, the SOS feature runs in simulation mode (logs messages to console instead of sending SMS).

## 🏃 Running the Project

You need to run **two terminals simultaneously** - one for the backend server and one for the frontend dev server.

### Terminal 1: Start the Backend Server

```bash
node backend/server.cjs
```

Expected output:
```
No Twilio credentials found in .env! Backend is running in development/simulation mode.
MediBridge India API is securely tracking on port: 5001
AI Diagnosis API available at: http://localhost:5001/api/diagnose
Triage API available at: http://localhost:5001/api/triage
```

### Terminal 2: Start the Frontend Dev Server

```bash
npm run dev
```

> **⚠️ Note for Windows PowerShell users:** If `npx` commands fail due to PowerShell's execution policy, use `npm run dev` instead — it's pre-configured in `package.json` and works on all systems (Windows CMD, PowerShell, macOS/Linux terminal). Alternatively, open the project in **Command Prompt (cmd.exe)** instead of PowerShell, or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell session before using `npx`.

Expected output:
```
VITE v8.0.3  ready in 460 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.26:5173/
```

### 3. Open the Application

Open your browser and navigate to: **http://localhost:5173/**

## 📡 API Endpoints

The backend runs on `http://localhost:5001` and provides the following APIs:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/diagnose` | AI diagnosis based on dataset and symptoms |
| GET | `/api/diagnose/specialties` | List all available medical specialties |
| GET | `/api/diagnose/diseases/:specialty` | Get diseases for a specific specialty |
| POST | `/api/triage` | Symptom-based triage across specialties |
| POST | `/send-sos` | Send emergency SOS alerts to contacts |

### Example: AI Diagnosis Request

```bash
curl -X POST http://localhost:5001/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "dataset": "ChestMNIST",
    "symptoms": ["cough", "fever", "shortness of breath"],
    "patient_age": 45,
    "patient_gender": "male"
  }'
```

### Example: Triage Request

```bash
curl -X POST http://localhost:5001/api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["headache", "blurred vision"],
    "age": 55,
    "gender": "female"
  }'
```

## 🗂️ Project Structure

```
MediCity-Minor-Project2-/
├── backend/
│   ├── .env                  # Environment variables
│   └── server.cjs            # Express backend server
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── models/
├── src/
│   ├── assets/               # Static assets
│   ├── components/           # Reusable components
│   ├── context/              # React context providers
│   ├── dashboard/            # Dashboard page components
│   │   ├── AIDiagnosis.jsx   # AI Diagnosis module
│   │   ├── BloodFinder.jsx   # Blood bank finder
│   │   ├── Consultation.jsx  # Consultation booking
│   │   ├── Exercise.jsx      # Exercise & wellness
│   │   ├── Overview.jsx      # Dashboard overview
│   │   └── Schemes.jsx       # Government schemes
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Login.jsx         # Login page
│   │   └── Signup.jsx        # Signup page
│   ├── App.css
│   ├── App.jsx               # Root React component
│   ├── index.css             # Global styles
│   └── main.jsx              # Application entry point
├── index.html                # HTML template
├── package.json              # Frontend dependencies & scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🖥️ System-Specific Notes

### Windows
- Use **Command Prompt**, **PowerShell**, or **Git Bash**
- Run commands as shown above
- Paths use backslashes (`\`) but forward slashes (`/`) also work in most cases

### macOS / Linux
- Use **Terminal**
- Commands are identical to those shown above
- All paths use forward slashes (`/`)

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Module not found` errors | Run `npm install` in the project root |
| Port 5001 in use | Change `PORT` in `backend/.env` to another value (e.g., `5002`) |
| Port 5173 in use | Vite will automatically try the next available port |
| Backend won't start | Ensure you're running `node backend/server.cjs` from the project root |
| CORS errors | The backend has CORS enabled; ensure the frontend URL matches |

## 🎯 Available npm Scripts

```bash
npm run dev      # Start Vite dev server (frontend only)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📄 License

This project is developed as part of an academic minor project.

## 👥 Contributors

- [Mishika Bagrecha](https://github.com/mishikabagrecha)