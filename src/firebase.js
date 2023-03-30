import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC7mHyHMpGf0NN1u_Gl5T3PL3tVWRm2u8M",
  authDomain: "indo-german.firebaseapp.com",
  projectId: "indo-german",
  storageBucket: "indo-german.appspot.com",
  messagingSenderId: "939695498933",
  appId: "1:939695498933:web:08bf281c786ee7d78740fc",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth();
