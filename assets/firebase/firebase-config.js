import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

//firebaseConfig = {
  apiKey: "AIzaSyCP2Uwo1lx996q0l3nkC7RhAesVuIHEXiA",
  authDomain: "nihongo-zen-cd97d.firebaseapp.com",
  projectId: "nihongo-zen-cd97d",
  storageBucket: "nihongo-zen-cd97d.firebasestorage.app",
  messagingSenderId: "513320956483",
  appId: "1:513320956483:web:84729a0c4c44b76af65af6",
  measurementId: "G-PCERH9R58D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email (user input se lena hai)
const email = "user@example.com";

// Action Code Settings
const actionCodeSettings = {
  url: "http://localhost:5500/finishSignUp.html", 
  // production me:
  // url: "https://your-domain.com/finishSignUp.html",

  handleCodeInApp: true,

  iOS: {
    bundleId: "com.example.ios",
  },

  android: {
    packageName: "com.example.android",
    installApp: true,
    minimumVersion: "12",
  },

  // optional custom domain
  linkDomain: "your-domain.com",
};

// Send Email Link
sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    // Save email locally
    window.localStorage.setItem("emailForSignIn", email);
    alert("Email link sent! Check your inbox.");
  })
  .catch((error) => {
    console.error(error.code, error.message);
  });
