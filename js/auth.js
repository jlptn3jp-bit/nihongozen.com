import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ================= EMAIL LOGIN ================= */
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    return alert("Please enter email and password");
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

/* ================= SIGNUP ================= */
document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    return alert("Please enter email and password");
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created! Now login.");
  } catch (err) {
    alert(err.message);
  }
});

/* ================= GOOGLE LOGIN ================= */
document.getElementById("googleLogin")?.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

/* ================= EMAIL LINK LOGIN ================= */
const actionCodeSettings = {
  url: window.location.href,
  handleCodeInApp: true
};

document.getElementById("emailLogin")?.addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value.trim();

  if (!email) return alert("Enter email");

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    alert("Login link sent!");
  } catch (err) {
    alert(err.message);
  }
});

/* ================= COMPLETE EMAIL LOGIN ================= */
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

/* ================= GLOBAL NAV ================= */
window.goSignup = () => {
  window.location.href = "signup.html";
};
