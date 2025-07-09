// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb40AK63nHKPh-tOq_kmQXY0rDFlMuls8",
  authDomain: "letsrise-auth.firebaseapp.com",
  projectId: "letsrise-auth",
  storageBucket: "letsrise-auth.firebasestorage.app",
  messagingSenderId: "495041619188",
  appId: "1:495041619188:web:d7f67a992128c54e7ceaa1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Initialize Analytics only on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { auth, googleProvider, db };