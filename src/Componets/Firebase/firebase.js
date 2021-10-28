import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInAnonymously, updateProfile, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const v9FirebaseApp = initializeApp(firebaseConfig);
const v9DB = getFirestore(v9FirebaseApp);
const v9Auth = getAuth(v9FirebaseApp);
const v9Provider = new GoogleAuthProvider();

export { firebaseApp, auth, provider, v9FirebaseApp, v9DB, v9Auth, collection, onAuthStateChanged, signInAnonymously, signInWithPopup, updateProfile, v9Provider };
export default db;
