import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";

//CONFIG
import dotenv from "dotenv";
dotenv.config();
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_APIKEY,
  authDomain: process.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECTID,
  storageBucket: process.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.VITE_FIREBASE_APPID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENTID,
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

//FIRESTORE
let db = getFirestore();
if (process.env.VITE_USE_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
//const userDoc = (userId) => doc(db, "users", userId);

//AUTHENTICATION
const auth = getAuth(firebaseApp);
const cred = process.env.VITE_FIREBASE_AUTHCRED;
const scrt = process.env.VITE_FIREBASE_AUTHSECRET;
signInWithEmailAndPassword(auth, cred, scrt)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  });
export { auth, db };
