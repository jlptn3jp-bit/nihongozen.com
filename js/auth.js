// auth.js (simplified)
import { getAuth, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";

const auth = getAuth();

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user.emailVerified) {
      // User verified
      return result.user;
    } else {
      // Send verification email
      await sendEmailVerification(result.user);
      alert('Verification email sent. Please verify your email.');
    }
  } catch (error) {
    console.error(error);
    alert('Login failed.');
  }
}
