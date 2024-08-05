import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBSuq1rs6-Tmg5PY2GtU17pfVta3MrpCC8",
    authDomain: "inventory-management-app-38a5b.firebaseapp.com",
    projectId: "inventory-management-app-38a5b",
    storageBucket: "inventory-management-app-38a5b.appspot.com",
    messagingSenderId: "322158468918",
    appId: "1:322158468918:web:c5f0dd3862fdd56a36dd97",
    measurementId: "G-9QXS2LYE0M"
  };
  

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);


export { firestore, auth };
