// ===== Firebase Configuration =====
// CargoLoop Firebase Project

const firebaseConfig = {
    apiKey: "AIzaSyDlaoKRvt7AvSiUIcA5zEn7u6BZwHUqhuc",
    authDomain: "cargoloop-da4e8.firebaseapp.com",
    databaseURL: "https://cargoloop-da4e8-default-rtdb.firebaseio.com",
    projectId: "cargoloop-da4e8",
    storageBucket: "cargoloop-da4e8.firebasestorage.app",
    messagingSenderId: "86022292943",
    appId: "1:86022292943:web:4e7f4872dfeed227adfeba",
    measurementId: "G-LN00JWXSCV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
