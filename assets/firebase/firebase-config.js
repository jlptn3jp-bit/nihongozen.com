import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com", // localhost ke liye bhi ye hi rahega
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
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
