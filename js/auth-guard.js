import { app } from "./firebase.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});
