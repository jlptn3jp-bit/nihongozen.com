import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ================= USER INFO ================= */
onAuthStateChanged(auth, (user) => {
  if (user) {
    const emailEl = document.getElementById("userEmail");
    if (emailEl) {
      emailEl.textContent = user.email;
    }
  } else {
    // safety redirect (backup)
    window.location.href = "index.html";
  }
});

/* ================= LOGOUT ================= */
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* ================= LOAD LEVEL ================= */
document.querySelectorAll("[data-level]").forEach(btn => {
  btn.addEventListener("click", () => {
    loadLevel(btn.dataset.level);
  });
});

async function loadLevel(level) {
  try {
    const res = await fetch(`data/${level}/vocab.json`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    const container = document.getElementById("content");
    container.innerHTML = `<h3>${level.toUpperCase()} Vocabulary</h3>`;

    data.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `<b>${item.word}</b> - ${item.meaning}`;
      div.style.cursor = "pointer";

      div.onclick = () => {
        if (item.audio) {
          new Audio(item.audio).play();
        }
      };

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Error loading data");
  }
}
