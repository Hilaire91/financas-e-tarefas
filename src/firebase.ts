import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "sustained-guru-vfs6l",
  appId: "1:242146888838:web:fa9adaf525a91f1fdad507",
  apiKey: "AIzaSyCrrF0hgC2Gyya0CqPKq2CeR47JiAsQkRE",
  authDomain: "sustained-guru-vfs6l.firebaseapp.com",
  storageBucket: "sustained-guru-vfs6l.firebasestorage.app",
  messagingSenderId: "242146888838",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
