// firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_DPxRi7TyB_7XVqFYI5RIs1R-l96iQgo",
  authDomain: "webapp-a4bba.firebaseapp.com",
  projectId: "webapp-a4bba",
  storageBucket: "webapp-a4bba.appspot.com", 
  messagingSenderId: "180635748658",
  appId: "1:180635748658:web:a548697366103dbb0e2f2b",
  measurementId: "G-K7WGT4WZTP"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
export default auth;
