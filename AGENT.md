# AGENT.md: AI Agent System Architecture & Developer Guide

This document serves as the authoritative blueprint and operating manual for AI agents and human engineers building, extending, or maintaining the **Culture Guide AI** platform.

---

## 📍 1. Executive System Summary

**Culture Guide AI** is a multi-tier, hybrid MERN + Python AI microservice application designed to recognize cultural heritage sites from user-submitted photos and serve rich contextual stories, historical metadata, audio guides, interactive maps, and visit history.

### Core Stack
* **AI Recognition Engine**: Python 3.14+, FastAPI, PyTorch, OpenCLIP (`ViT-B-32`), Pillow, NumPy.
* **API Gateway & Business Logic**: Node.js, Express.js, Mongoose, JWT, Multer, Axios.
* **Frontend Mobile Client**: React 18 / 19, TypeScript, Vite 6, Tailwind CSS v4, Motion (`motion/react`), Lucide React.
* **Interactive Mapping Subsystem**: Leaflet, OpenStreetMap, CartoDB Voyager Tile Engine, Browser Geolocation API.
* **Audio Narration Engine**: Web Speech API (`SpeechSynthesisUtterance`), Dynamic Voice Selector, Equalizer Waveform Animations.
* **Camera Hardware Subsystem**: WebRTC `getUserMedia` stream API, offscreen `<canvas>` JPEG snapshot capture, fallback input picker.
* **Database & Persistence**: MongoDB (User accounts, Visit History logs, Heritage Site metadata) with in-memory fallback for offline zero-downtime execution.
* **Hardware Acceleration**: Automatic device auto-detection (`mps` for Apple Silicon, `cuda` for NVIDIA GPUs, CPU fallback).

---

## 🏗️ 2. Architectural Blueprint

```text
                                +-----------------------------------+
                                |     React Mobile UI (Vite 5173)   |
                                | (Leaflet Map + WebSpeech + Camera)|
                                +-----------------+-----------------+
                                                  |
                                                  | HTTP / REST (Multipart / JSON)
                                                  v
                                  +-------------------------------+
                                  |    Express API Server (5001)  |
                                  |  (Node.js + Mongoose + JWT)   |
                                  +---------------+---------------+
                                                  |
                        +-------------------------+-------------------------+
                        |                                                   |
                        v (Internal HTTP)                                   v (Mongoose Driver)
          +----------------------------+                          +-------------------+
          | Python AI Service (8000)   |                          |   MongoDB Database|
          | (FastAPI + OpenCLIP)       |                          |   (culture_guide_db)|
          +--------------+-------------+                          +-------------------+
                         |
                         v
          +----------------------------+
          |  embeddings.pkl Vector DB  |
          +----------------------------+
```

---

## 📂 3. Directory Layout & Module Responsibilities

```text
culture-guide-ai/
├── ai-service/                   # Python FastAPI OpenCLIP Microservice
│   ├── core/
│   │   ├── clip_model.py         # Hardware device selection & model transformer loader
│   │   ├── embedding.py          # L2 vector normalization, PIL image loader, multi-image averaging
│   │   └── matcher.py            # Cosine similarity vector classification with confidence thresholding
│   ├── data/
│   │   ├── images/               # Reference dataset organized into subdirectories per site
│   │   │   ├── Bindhyabasini_Temple/
│   │   │   ├── Lumbini/
│   │   │   └── Patan_Durbar_Square/
│   │   └── heritage.json         # Static catalog metadata for quick fallback lookup
│   ├── database/
│   │   └── embeddings.pkl        # Pickle file storing averaged unit vectors { site_name: Tensor(1, 512) }
│   ├── scripts/
│   │   └── create_embeddings.py   # Dataset scanner script that generates embeddings.pkl
│   ├── main.py                   # FastAPI service entrypoint (Endpoints: /predict, /health)
│   └── requirements.txt          # Python dependencies
├── server/                       # Node.js + Express + MongoDB Backend
│   ├── config/
│   │   └── db.js                 # Mongoose connection configuration (bufferCommands: false on timeout)
│   ├── controllers/
│   │   ├── authController.js     # User registration & JWT authentication (MongoDB + memory fallback)
│   │   ├── heritageController.js # Site catalog retrieval & lookup (MongoDB + heritage.json fallback)
│   │   ├── recognitionController.js # Receives upload & proxies to Python AI service
│   │   └── storyController.js    # Cultural story & narrative guide generator (xAI Grok API + catalog)
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token protection middleware
│   │   └── errorMiddleware.js    # Global error & 404 handler
│   ├── models/
│   │   ├── HeritageSite.js       # Heritage Site collection schema
│   │   ├── User.js               # User accounts schema (bcrypt password hashing)
│   │   └── VisitHistory.js       # User visit logs schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── heritageRoutes.js     # /api/heritage endpoints
│   │   ├── recognitionRoutes.js  # /api/recognize endpoint
│   │   └── storyRoutes.js        # /api/story endpoint
│   ├── services/
│   │   ├── aiService.js          # Axios FormData HTTP bridge to Python AI service
│   │   └── storyService.js       # Narrative generation logic
│   ├── .env                      # Environment variables
│   └── server.js                 # Express app initialization
├── Culture Guide AI Mobile UI/   # React Mobile Client Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx # Context provider for token storage & session state
│   │   │   ├── services/
│   │   │   │   └── api.ts         # Centralized typed HTTP API service layer
│   │   │   └── App.tsx            # Main application router, screens & UI components
│   │   ├── main.tsx              # React DOM entrypoint
│   │   └── styles/               # Tailwind CSS & theme tokens
│   ├── vite.config.ts            # Vite config with /api development proxy to Express (port 5001)
│   └── package.json              # Frontend dependencies (leaflet, motion, lucide-react)
├── AGENT.md                      # AI Agent Developer Guide (This file)
└── README.md                     # High-level project documentation
```

---

## 🗺️ 4. Interactive Mapping Subsystem Architecture

The map subsystem in `MapScreen` uses an open-source, keyless mapping pipeline:
1. **Engine**: Leaflet JS (`leaflet`) coupled with CartoDB Voyager raster tiles (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`).
2. **Custom Pins**: Dynamic HTML `L.divIcon` pins rendered for each recognized heritage site (e.g., Patan Durbar Square `[27.6727, 85.3253]`, Bindhyabasini Temple `[28.2380, 83.9856]`, Lumbini `[27.4840, 83.2760]`).
3. **User Geolocation**: Asynchronously queries `navigator.geolocation.getCurrentPosition` to plot a pulsing user location marker on the active map canvas.
4. **Interactions**: Tapping map pins triggers smooth map camera panning (`map.flyTo`) and selects the site card for instant navigation to the site details screen.

---

## 🔊 5. AI Audio Speech Synthesis Subsystem

The audio guide subsystem in `AudioGuideScreen` and `ResultScreen` provides spoken narration:
1. **Speech Engine**: Web Speech API (`window.speechSynthesis`).
2. **Voice Selection**: Queries available system voices (`SpeechSynthesisUtterance`) to pick natural English voices (`Samantha`, `Google`, or system preferred voice).
3. **Playback Controls**: Supports Play, Pause, Resume, Speed adjustment (`1x`, `1.25x`, `1.5x`), and Replay.
4. **Visual Feedback**: Real-time animated waveform equalizer bars (`motion.div`) synchronize with speech state (`utterance.onboundary`).
5. **Teardown**: Automatically cancels active utterances on component unmount (`speechSynthesis.cancel()`).

---

## 📸 6. Live Hardware Camera Subsystem

The AI scanning screen (`CameraScreen`) provides direct hardware camera interaction:
1. **Stream Access**: Invokes `navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })`.
2. **Viewfinder**: Streams real-time video feed to a `<video>` element with reticle overlay.
3. **Snapshot Capture**: Tapping the shutter button draws the current frame to an offscreen `<canvas>`, converts it to a JPEG `Blob`/`File`, and sends it to `POST /api/recognize`.
4. **Fallback & Gallery**: Provides dedicated Gallery and File Picker options (`<input type="file" accept="image/*">`) if live camera permissions are withheld.

---

## 🤖 7. AI Recognition Pipeline Math & Logic

The visual recognition system operates without traditional weight training by projecting images into CLIP's joint vision-language vector space:

1. **Feature Extraction**: Given an input image $I$, the image preprocessor resizes and crops $I$ into $224 \times 224 \times 3$, then passes it through the CLIP Vision Transformer ($ViT-B-32$) encoder $f(I) \in \mathbb{R}^{512}$.
2. **L2 Normalization**:
   $$\hat{v} = \frac{f(I)}{\|f(I)\|_2}$$
3. **Multi-Image Site Reference Averaging**: For a site $S$ with $N$ reference images $\{I_1, I_2, \dots, I_N\}$:
   $$\bar{v}_S = \frac{\frac{1}{N} \sum_{i=1}^N \hat{v}_{I_i}}{\left\| \frac{1}{N} \sum_{i=1}^N \hat{v}_{I_i} \right\|_2}$$
4. **Cosine Similarity Classification**: Given query image vector $q$, calculate similarity with each stored site vector $\bar{v}_S$:
   $$\text{Sim}(q, \bar{v}_S) = q \cdot \bar{v}_S^T$$
5. **Threshold Verification**:
   $$\text{Predicted Site} = \begin{cases} \arg\max_{S} \text{Sim}(q, \bar{v}_S), & \text{if } \max_S \text{Sim}(q, \bar{v}_S) \ge \tau \\ \text{Unrecognized Site}, & \text{otherwise} \end{cases}$$
   *(Default confidence threshold $\tau = 0.60$)*.

---

## 🛠️ 8. Operating Procedures for AI Agents & Developers

### Startup Sequence for Local Development
1. **Launch Python AI Service (Port 8000)**:
   ```bash
   cd culture-guide-ai/ai-service
   source venv/bin/activate
   python main.py
   ```
2. **Launch Node.js Express Backend (Port 5001)**:
   ```bash
   cd culture-guide-ai/server
   node server.js
   ```
3. **Launch React Frontend Client (Port 5173)**:
   ```bash
   cd "Culture Guide AI Mobile UI"
   npm run dev
   ```

### ADB Reverse Port Forwarding for Android Testing
To test the mobile app over USB-C cable on an Android device:
```bash
adb reverse tcp:5173 tcp:5173
adb reverse tcp:5001 tcp:5001
```

---

## ⚠️ 9. Strict Agent Guidelines & Conventions

When modifying this repository, AI agents must adhere to the following rules:

1. **Do Not Mutate Recognition Core**: Do not alter the CLIP embedding normalization or similarity matching math in `core/embedding.py` and `core/matcher.py` unless explicitly requested.
2. **Error Isolation**: The Express backend must gracefully handle cases where the Python AI microservice or MongoDB is offline without crashing the Node process.
3. **Buffer Prevention**: Mongoose connection errors must set `mongoose.set('bufferCommands', false)` to prevent 10-second request hangs when offline.
