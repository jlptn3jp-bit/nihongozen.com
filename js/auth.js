import { getAuth, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";

const auth = getAuth();

document.getElementById('login-btn').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      document.getElementById('status').textContent = 'Verification email sent. Please verify your email.';
    } else {
      window.location.href = "dashboard.html"; // redirect after login
    }
  } catch (error) {
    console.error(error);
    document.getElementById('status').textContent = 'Login failed.';
  }
});
