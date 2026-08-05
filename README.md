# 🏛️ AI Tourist Guide — Mobile Experience

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1-38BDF8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-OpenCLIP-EE4C2C.svg?logo=pytorch)](https://pytorch.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF.svg?logo=capacitor)](https://capacitorjs.com/)

**AI Tourist Guide** is an intelligent, AI-powered cultural heritage companion designed for mobile devices. Powered by deep visual recognition (**OpenCLIP / PyTorch**), interactive maps, immersive audio guides, and localized storytelling, AI Tourist Guide transforms smartphone cameras into living tour guides for temples, stupas, and UNESCO World Heritage sites.

---

## 🌟 Key Features

- 📸 **AI Visual Monument Recognition**: Scan any temple, stupa, or historical monument using your camera or gallery upload. Zero-shot visual classification powered by OpenCLIP identifies heritage sites instantly.
- 🗺️ **Interactive Heritage Map**: Explore nearby historical landmarks using interactive Leaflet map overlays, live distance markers, and custom category filter chips.
- 🎧 **AI Audio Guide & Companion**: Interactive voice-guided walkthroughs with real-time cultural Q&A assistant ("Ara", the Himalayan Guardian Spirit).
- 📜 **Cultural Storytelling**: Generates deep historical narratives, mythologies, architectural insights, and visitor tips for recognized sites.
- 🎖️ **Digital Passport & Achievements**: Earn virtual stamps, collect heritage badges, and track your site visits across UNESCO landmarks.
- 📶 **Offline Mode & Data Packs**: Downloadable regional heritage packs for exploring remote historical areas without an active cellular connection.
- 📱 **Cross-Platform Native Mobile & PWA**: Runs seamlessly as a progressive web app (PWA) with native mobile device camera integration, or builds directly into a native Android APK via Capacitor.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client [Mobile Client / Web PWA]
        UI[React + TypeScript + Tailwind UI]
        Cam[Camera & Gallery Integration]
        Map[Leaflet Interactive Map]
        Cap[Capacitor Native Android Bridge]
    end

    subgraph Backend [Express Node.js API Server]
        Auth[JWT Authentication & User Session]
        API[Heritage Sites REST Controller]
        Upload[Multer Image Processor]
    end

    subgraph AIService [Python AI Vision Microservice]
        FastAPI[FastAPI Gateway]
        CLIP[OpenCLIP / PyTorch Model]
        Embedding[Vector Feature Matching]
    end

    subgraph Database [Database Layer]
        Mongo[(MongoDB Heritage Collection)]
    end

    UI -->|HTTP / HTTPS| API
    Cam -->|Upload Image| Upload
    Upload -->|Forward Image Payload| FastAPI
    FastAPI --> CLIP --> Embedding
    Embedding -->|Recognized Site Meta| FastAPI
    FastAPI -->|JSON Result| Upload
    API <--> Mongo
```

---

## 🛠️ Tech Stack

### Frontend & Mobile
- **Core**: React 18, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4, Motion (Framer Motion), Lucide Icons
- **Mapping**: Leaflet & React-Leaflet
- **Native Wrapper**: Capacitor Android (`@capacitor/android`, `@capacitor/cli`)

### Node.js Backend API
- **Runtime**: Node.js & Express
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Storage**: Multer multipart form handling

### Python AI Vision Service
- **Framework**: FastAPI & Uvicorn
- **AI Core**: PyTorch & OpenCLIP (`open_clip_torch`)
- **Image Processing**: Pillow (PIL)

---

## 📁 Folder Structure

```
AI Tourist Guide/
├── src/                          # Modular React / TypeScript App
│   ├── app/
│   │   ├── components/common/   # Reusable UI components (Buttons, Cards, NavBar, PhoneFrame)
│   │   ├── constants/           # Static data, onboarding slides & site images
│   │   ├── context/             # AuthContext state provider
│   │   ├── screens/             # Modular domain views
│   │   │   ├── auth/            # Splash, Onboarding, Login, Register
│   │   │   ├── explore/         # Map, Directory Explorer, Search
│   │   │   ├── home/            # Main Dashboard
│   │   │   ├── scan/            # Camera Scanner, AI Processing, Result View
│   │   │   ├── site/            # Site Details, AI Story, Audio Guide
│   │   │   ├── system/          # Offline Mode, Error View
│   │   │   └── user/            # Saved, History, Achievements, Profile, Settings
│   │   ├── services/            # API client service methods
│   │   ├── types/               # TypeScript interfaces & screen unions
│   │   └── App.tsx              # Application Root Router
│   └── styles/                  # Global CSS & Tailwind imports
├── server/                      # Node.js Express REST Backend
│   ├── controllers/             # Authentication & Heritage Controllers
│   ├── models/                  # MongoDB Schemas (User, Site, Visit)
│   ├── routes/                  # Express Router endpoints
│   └── server.js                # Server entry point (Port 5001)
├── ai-service/                  # Python OpenCLIP Microservice
│   ├── core/                    # OpenCLIP feature extraction engine
│   ├── data/                    # Heritage site reference embeddings
│   ├── main.py                  # FastAPI server entry point
│   └── requirements.txt         # Python dependencies
├── android/                     # Capacitor Native Android Project
│   └── app/src/main/            # Android Manifest & Native Assets
├── capacitor.config.json        # Capacitor configuration
├── vite.config.ts               # Vite bundler & basicSSL HTTPS config
└── package.json                 # Web dependencies & build scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Python**: `3.9` or higher (for AI microservice)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string

---

### 1. Clone & Install Frontend Dependencies

```bash
git clone https://github.com/krishal77/cation-1.git
cd "AI Tourist Guide"

# Install frontend packages
npm install
```

---

### 2. Configure Environment Variables

Create `.env` files in both backend and AI service directories:

**Backend (`server/.env`):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/culture_guide_ai
JWT_SECRET=your_jwt_secret_key_here
AI_SERVICE_URL=http://localhost:8000
```

---

### 3. Start the Services

#### A. Node.js Backend Server
```bash
cd server
npm install
npm run dev
```
*(Runs on `http://localhost:5001`)*

#### B. Python AI Vision Microservice (Optional for offline AI testing)
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*(Runs on `http://localhost:8000`)*

#### C. React Frontend Application
```bash
# In the root directory:
npm run dev
```
*(Runs on `https://localhost:5173` or local Wi-Fi IP `https://192.168.x.x:5173` with auto-generated SSL for mobile browser camera support)*

---

## 📱 Mobile Deployment & Testing

### Option 1: Mobile Browser PWA (Instant Wi-Fi Access)
1. Run `npm run dev` on your computer.
2. Open the network URL displayed in terminal (e.g. `https://192.168.1.106:5173/`) in **Chrome** (Android) or **Safari** (iOS).
3. Accept the local self-signed SSL warning (required for Web Camera access over local Wi-Fi).
4. Tap **"Add to Home Screen"** or **"Install App"** in your browser menu to run standalone!

### Option 2: Native Android APK (via Capacitor)
```bash
# Build the production bundle & sync with native Android project
npm run build
npx cap sync android

# Open project in Android Studio to build .apk or deploy directly
npx cap open android
```

---

## 🧪 Verification & Building

To verify TypeScript static types and build the production bundle:

```bash
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
