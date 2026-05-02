import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("user-email").textContent =
      "Email: " + user.email;
  }
});

document.getElementById("logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
