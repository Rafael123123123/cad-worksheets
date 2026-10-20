import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Web firebaseConfig from Firebase console > Project settings > Your apps.
// This identifies the project; it is not the private service account key.
const firebaseConfig = {
  apiKey: "AIzaSyBXVhMTVdD3cwExfrupI-RHpvWNp1iDumk",
  authDomain: "cad-2022131195.firebaseapp.com",
  databaseURL: "https://cad-2022131195-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cad-2022131195",
  storageBucket: "cad-2022131195.firebasestorage.app",
  messagingSenderId: "646507712252",
  appId: "1:646507712252:web:c1ed49aa77c94a89039179"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
