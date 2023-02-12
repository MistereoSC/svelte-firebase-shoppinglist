import { deleteApp, getApp, getApps, initializeApp } from "Firebase/app";
import { getAuth, setPersistence, inMemoryPersistence } from "Firebase/auth";
import {
  doc,
  getFirestore,
  connectFirestoreEmulator,
} from "Firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

const auth = getAuth(firebaseApp);
let db = getFirestore();
if (process.env.NODE_ENV === "development") {
  console.warn("Starting in: " + process.env.NODE_ENV);
  connectFirestoreEmulator(db, "localhost", 8080);
}
const userDoc = (userId) => doc(db, "users", userId);

export { auth, db };
