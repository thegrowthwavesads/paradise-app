import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACC9SHw4eqEciw9g4RPMRFNDYa39NMwzE",
  authDomain: "paradise-app-c9d44.firebaseapp.com",
  projectId: "paradise-app-c9d44",
  storageBucket: "paradise-app-c9d44.firebasestorage.app",
  messagingSenderId: "681898873988",
  appId: "1:681898873988:web:d89ff0b9412484afa49ed1",
  measurementId: "G-E17MK7BN9K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const ADMIN_EMAIL = 'admin@paradisetoursglb.in';
export const ADMIN_PASSWORD = 'Paradise@Admin2024';
