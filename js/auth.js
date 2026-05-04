import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

// ✅ INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// ==============================
// 🔵 GOOGLE LOGIN (OLD + NEW MERGED)
// ==============================

// for new button (googleLogin)
document.getElementById("googleLogin")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

// for old button (loginBtn)
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
    alert(error.message);
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
// 🔗 NAVIGATION
// ==============================

window.goSignup = () => {
  window.location.href = "signup.html";
};
