
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  projectId: "diagnosis-decipher-kztzx",
  appId: "1:474104676024:web:587061f45a24638ee0fe4d",
  storageBucket: "diagnosis-decipher-kztzx.firebasestorage.app",
  apiKey: "AIzaSyAIUSl67qYPOy9mClnGmhkzKTCez_dhAP8",
  authDomain: "diagnosis-decipher-kztzx.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "474104676024",
  databaseURL: "https://diagnosis-decipher-kztzx-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
