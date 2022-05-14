// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD6JkmEooq69Dmh-LB0MQGMcHRQ6-eJw5I",
    authDomain: "torres-ticket-reservation.firebaseapp.com",
    projectId: "torres-ticket-reservation",
    storageBucket: "torres-ticket-reservation.appspot.com",
    messagingSenderId: "480586694261",
    appId: "1:480586694261:web:4cb0afe5a60e311a0e823c",
    measurementId: "G-RME27V8611"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()