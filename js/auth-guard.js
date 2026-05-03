// js/auth-guard.js
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user || !user.emailVerified) {
    window.location.href = "index.html"; // or welcome.html
  }
});
