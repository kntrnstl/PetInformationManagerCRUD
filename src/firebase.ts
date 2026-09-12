import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "petinformationmanagercrud.firebaseapp.com",
  databaseURL: "https://petinformationmanagercrud-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "petinformationmanagercrud",
  storageBucket: "petinformationmanagercrud.firebasestorage.app",
  messagingSenderId: "538044662477",
  appId: "1:538044662477:web:c3c9c84b119b1b57955f84"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);