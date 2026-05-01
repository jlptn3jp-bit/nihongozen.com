// js/auth.js

// Initialize Firebase (use your own firebase-config.js)
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

async function handleLogin(e) {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Invalid email or password");
  }
}

document.getElementById('loginForm').addEventListener('submit', handleLogin);
