import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 FIREBASE CONFIG (YOUR KEY ADDED)
const firebaseConfig = {
  apiKey: "AIzaSyCP2Uwo1lx996q0l3nkC7RhAesVuIHEXiA",
  authDomain: "nihongo-zen-cd97d.firebaseapp.com",
  projectId: "nihongo-zen-cd97d",
  storageBucket: "nihongo-zen-cd97d.firebasestorage.app",
  messagingSenderId: "513320956483",
  appId: "1:513320956483:web:a1069825e0df3587f65af6",
  measurementId: "G-1WTJ5ML3R2"
};

// ✅ INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// ==============================
// 🔵 GOOGLE LOGIN
// ==============================
document.getElementById("googleLogin")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});


// ==============================
// 🟡 EMAIL LINK LOGIN
// ==============================
const actionCodeSettings = {
  url: window.location.href,
  handleCodeInApp: true
};

document.getElementById("emailLogin")?.addEventListener("click", async () => {
  const email = document.getElementById("emailInput")?.value;

  if (!email) return alert("Enter email");

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    alert("Login link sent to your email!");
  } catch (err) {
    alert(err.message);
  }
});


// ==============================
// ✅ COMPLETE EMAIL LOGIN
// ==============================
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = localStorage.getItem("emailForSignIn");

  if (!email) {
    email = prompt("Enter your email again");
  }

  signInWithEmailLink(auth, email, window.location.href)
    .then(() => {
      localStorage.removeItem("emailForSignIn");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}


// ==============================
// 🔐 PROTECT PAGE (AUTH CHECK)
// ==============================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // only redirect if NOT on login page
    if (!window.location.pathname.includes("index.html")) {
      window.location.href = "index.html";
    }
  }
});


// ==============================
// 🔗 NAVIGATION
// ==============================
window.goSignup = () => {
  window.location.href = "signup.html";
};
