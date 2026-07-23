import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPX8GqGLLFDzRGnjhjJj_ovy88ulpK-D4",
  authDomain: "vetaas-7aeae.firebaseapp.com",
  projectId: "vetaas-7aeae",
  storageBucket: "vetaas-7aeae.firebasestorage.app",
  messagingSenderId: "842136456402",
  appId: "1:842136456402:web:0eec21ac86ec694a91310b",
  measurementId: "G-1JKRXKWR09"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Keep visitors signed in anonymously (required to submit membership orders),
// but never replace an existing session — signing in anonymously while the
// admin is logged in would silently kick them back to anonymous.
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    if (!user) signInAnonymously(auth).catch(console.warn);
  });
}
