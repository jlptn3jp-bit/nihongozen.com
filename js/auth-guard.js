import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 SAME CONFIG (must match your login file)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

// ✅ INIT (ONLY ONCE)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==============================
// 🔐 PROTECT PAGE (AUTH CHECK)
// ==============================

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
  }
});
