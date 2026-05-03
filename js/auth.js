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
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= SAVE USER ================= */
async function saveUserData(user, extraData = {}) {
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "",
      email: user.email,
      photo: user.photoURL || "assets/default-avatar.png",
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
      },
      ...extraData
    });
  }
}

/* ================= EMAIL LOGIN ================= */
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) return alert("Enter email & password");

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (!userCred.user.emailVerified) {
      alert("Please verify your email first.");
      return;
    }

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

/* ================= SIGNUP ================= */
document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) return alert("Fill required fields");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCred.user, {
      displayName: "New User",
      photoURL: "assets/default-avatar.png"
    });

    await sendEmailVerification(userCred.user);

    await saveUserData(userCred.user);

    alert("Account created! Verify your email.");
  } catch (err) {
    alert(err.message);
  }
});

/* ================= GOOGLE LOGIN ================= */
document.getElementById("googleLogin")?.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    await saveUserData(result.user);

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

/* ================= EMAIL LINK LOGIN ================= */
const actionCodeSettings = {
  url: window.location.origin + "/index.html",
  handleCodeInApp: true
};

document.getElementById("emailLogin")?.addEventListener("click", async () => {
  const email = document.getElementById("email")?.value.trim();

  if (!email) return alert("Enter email");

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    alert("Login link sent! Check your email.");
  } catch (err) {
    alert(err.message);
  }
});

/* ================= COMPLETE EMAIL LINK ================= */
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = localStorage.getItem("emailForSignIn");

  if (!email) email = prompt("Enter your email again");

  signInWithEmailLink(auth, email, window.location.href)
    .then(async (result) => {
      localStorage.removeItem("emailForSignIn");

      await saveUserData(result.user);

      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}

/* ================= NAV ================= */
window.goSignup = () => {
  window.location.href = "signup.html";
};
