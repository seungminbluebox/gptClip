// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 너의 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBINstWd4JjTgq8XAswM8YELKLcTbTRNXc",
  authDomain: "gptclip-9b81a.firebaseapp.com",
  projectId: "gptclip-9b81a",
  storageBucket: "gptclip-9b81a.firebasestorage.app",
  messagingSenderId: "779226689089",
  appId: "1:779226689089:web:cf2c44bc1e958df07b20c0",
  measurementId: "G-XY7CDVHG51",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
