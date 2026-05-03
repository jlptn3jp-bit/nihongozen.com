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

/* ================= COMMON FUNCTION ================= */
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
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

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
  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName = document.getElementById("lastName")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();

  if (!email || !password) return alert("Fill required fields");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    const fullName = `${firstName} ${lastName}`;

    await updateProfile(userCred.user, {
      displayName: fullName,
      photoURL: "assets/default-avatar.png"
    });

    await sendEmailVerification(userCred.user);

    await saveUserData(userCred.user, {
      firstName,
      lastName,
      phone
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
  const email = document.getElementById("emailInput")?.value.trim();

  if (!email) return alert("Enter email");

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    alert("Login link sent!");
  } catch (err) {
    alert(err.message);
  }
});

/* ================= COMPLETE EMAIL LINK LOGIN ================= */
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

/* ================= GLOBAL NAV ================= */
window.goSignup = () => {
  window.location.href = "signup.html";
};
