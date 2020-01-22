import firebase from "firebase/app";
import "firebase/firebase-firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLUmlSo70VlsGOJbSoR2eGNJLmntEIbNI",
  authDomain: "social-spark.firebaseapp.com",
  databaseURL: "https://social-spark.firebaseio.com",
  projectId: "social-spark",
  storageBucket: "social-spark.appspot.com",
  messagingSenderId: "151338365032",
  appId: "1:151338365032:web:d685c6e4e5f8912e444bdd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const firestore = firebase.firestore()

export default firebase