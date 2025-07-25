// Import required Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDnto0q-h6XawVj9IKYsKQUtIkmFlbGW2g",
  authDomain: "digital-kisan-hub.firebaseapp.com",
  projectId: "digital-kisan-hub",
  storageBucket: "digital-kisan-hub.appspot.com", // ✅ corrected bucket
  messagingSenderId: "855622178100",
  appId: "1:855622178100:web:4ac7add2c3af61dd6b4161",
  measurementId: "G-RTSBM0W5D4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export the services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ This fixes your error
