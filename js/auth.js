import { app } from "./firebase.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById("loginBtn")?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
  }
});
