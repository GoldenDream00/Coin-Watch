import firebaseConfig from "./config/firebase_config";
import { getAuth } from "firebase/auth";
import { initializeApp } from "@firebase/app";
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp);

export default auth;