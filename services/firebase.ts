import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSrCwFENDMrX7C0zBzQjpoS3SiE533e0E",
  authDomain: "traveljournal-2c515.firebaseapp.com",
  projectId: "traveljournal-2c515",
  storageBucket: "traveljournal-2c515.firebasestorage.app",
  messagingSenderId: "32946040178",
  appId: "1:32946040178:web:fe001868169f488c2701eb",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);