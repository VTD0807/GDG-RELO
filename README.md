# Relo: Proactive Resolution System

Relo is an intelligent, voice-first Customer Experience (CX) assistant designed to proactively resolve customer issues before they escalate. It leverages advanced conversational AI to analyze tone, intent, and frustration levels in real-time, delivering empathetic voice responses and actionable resolutions.

## 🚀 Features

* **Voice-First Interaction:** Customers speak directly to a dynamic "Voice Orb" interface.
* **Real-time Frustration Analysis:** Calculates frustration based on speech pace, pauses, and sentiment.
* **Proactive Action Cards:** Offers immediate resolutions (Refunds, Tracking, Support Escalation) tailored to the conversation.
* **Business Analytics Dashboard:** Owners can monitor session history, total interactions, and average customer sentiment.
* **Brand Customization:** Easily configure the AI's persona, business rules, and context from the dashboard.

---

## ☁️ Built with Google Cloud Ecosystem

Relo is powered entirely by the Google Cloud and Firebase ecosystem to ensure scalable, secure, and state-of-the-art performance.

### 1. Google Gemini AI (`gemini-1.5-flash`)
The core intelligence of Relo. We utilize the Gemini API to analyze complex session histories, extract intents, calculate sentiment scores, and generate warm, empathetic voice replies on the fly. Its lightning-fast response times make real-time voice interactions feel natural.

### 2. Firebase Authentication
Provides secure, out-of-the-box **Google Sign-In** for business owners. The frontend utilizes the Firebase Client SDK to authenticate users, while the backend uses the Firebase Admin SDK to securely verify ID tokens.

### 3. Google Cloud Firestore
Our NoSQL database of choice. Firestore handles our structured data storage seamlessly.
* **Businesses Collection:** Stores customized context, rules, and owner verification.
* **Sessions Collection:** Logs granular conversational turns (transcripts, AI responses, frustration scores) for analytics.

### 4. Firebase Hosting
The modern React/Vite frontend is built for performance and deployed directly to Firebase Hosting, which seamlessly handles our custom domain (`gdg.oqens.me`) and provisions free SSL certificates automatically.

---

## 🛠️ Local Development Setup

### Prerequisites
* Node.js (v18+)
* Firebase CLI (`npm install -g firebase-tools`)
* A Google Cloud Project with the Gemini API enabled.

### 1. Clone & Install
```bash
git clone https://github.com/VTD0807/GDG-RELO.git
cd GDG-RELO

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration
**Backend (`server/.env`)**
Create a `.env` file in the `server/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLOUD_PROJECT=your_firebase_project_id
PORT=8080
# Path to your downloaded Firebase Service Account JSON
GOOGLE_APPLICATION_CREDENTIALS=../your-service-account-file.json
```

**Frontend (`client/.env`)**
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Run the App Locally
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Navigate to `http://localhost:5173/login` in your browser.

---

## 🌐 Deployment (Vercel + Firebase)

Relo is designed for an easy, serverless deployment process.

1. **Backend (Vercel):** The Express backend is configured with a `vercel.json` file. Simply run `npx vercel` inside the `server/` directory to deploy to a free Vercel serverless environment.
2. **Frontend (Firebase):** Build the client (`npm run build`) and run `npx firebase deploy --only hosting` to push the React app to Firebase's global CDN.

---
*Built for the GDG AGENTIC PREMIER LEAGUE*
