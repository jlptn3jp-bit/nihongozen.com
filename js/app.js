// AUDIO FUNCTION
const playAudio = (audioSrc) => {
  const audio = new Audio(audioSrc);
  audio.play();
};


// Wait for DOM load
document.addEventListener("DOMContentLoaded", () => {

  const content = document.getElementById("content");

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const level = link.dataset.level;
      if (!level) return;

      try {
        // ✅ FETCH WITH ERROR CHECK
        const res = await fetch(`data/${level}/Vocab.json`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        content.innerHTML = "";

        data.forEach(item => {
          const div = document.createElement("div");
          div.textContent = `${item.word} - ${item.meaning}`;

          div.addEventListener("click", () => {
            if (item.audio) playAudio(item.audio);
          });

          content.appendChild(div);
        });

      } catch (err) {
        console.error("Error loading data:", err);
        content.innerHTML = "<p>Data load nahi hua ❌</p>";
      }
    });
  });

});


// Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCP2Uwo1lx996q0l3nkC7RhAesVuIHEXiA",
  authDomain: "nihongo-zen-cd97d.firebaseapp.com",
  projectId: "nihongo-zen-cd97d",
  storageBucket: "nihongo-zen-cd97d.firebasestorage.app",
  messagingSenderId: "513320956483",
  appId: "1:513320956483:web:c5b5cb0f9e63cb38f65af6",
  measurementId: "G-1JX3S73450"
};

const app = initializeApp(firebaseConfig);

// Safe analytics
isSupported().then((yes) => {
  if (yes) {
    getAnalytics(app);
  }
});
