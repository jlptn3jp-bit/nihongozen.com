import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= EMAIL LOGIN ================= */
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("Enter email & password");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

/* ================= SIGNUP ================= */
document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const firstName = document.getElementById("firstName")?.value || "";
  const lastName = document.getElementById("lastName")?.value || "";
  const email = document.getElementById("signupEmail")?.value || "";
  const phone = document.getElementById("phone")?.value || "";
  const password = document.getElementById("password")?.value || "";

  if (!email || !password) return alert("Fill required fields");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // update profile
    await updateProfile(userCred.user, {
      displayName: firstName + " " + lastName,
      photoURL: "assets/default-avatar.png"
    });

    // send verification
    await sendEmailVerification(userCred.user);

    // save to firestore
    await setDoc(doc(db, "users", userCred.user.uid), {
      firstName,
      lastName,
      email,
      phone,
      xp: 0,
      level: 1,
      streak: 0,
      progress: {
        n5: [],
        n4: [],
        n3: [],
        n2: [],
        n1: [],
        kanji: []
      }
    });

    alert("Account created! Verify your email.");
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

  if (!email) email = prompt("Enter your email again");

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
