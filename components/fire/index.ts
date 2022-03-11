import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBfhCF3lr7AejzdUsJF7DF5VJhE5EM6LGI",
  authDomain: "healthcheck-1a459.firebaseapp.com",
  databaseURL: "https://healthcheck-1a459-default-rtdb.firebaseio.com",
  projectId: "healthcheck-1a459",
  storageBucket: "healthcheck-1a459.appspot.com",
  messagingSenderId: "372087974519",
  appId: "1:372087974519:web:32395907117060c2fcb472",
  measurementId: "G-YG3FS88G70",
};

let analytics;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (app.name && typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Access Firebase services using shorthand notation
const firestore = getFirestore();
const auth = getAuth();
const database = getDatabase();

export { firestore, auth, database };
