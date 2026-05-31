import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8cfydMMwfxui9_W_KzmrTGd6_qroc1X8",
  authDomain: "relo-e8560.firebaseapp.com",
  projectId: "relo-e8560",
  storageBucket: "relo-e8560.firebasestorage.app",
  messagingSenderId: "356731857038",
  appId: "1:356731857038:web:21b809b02d260a8b4441df",
  measurementId: "G-948PV4Z2XL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (safely check if supported by browser)
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics };
