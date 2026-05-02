import { getAuth, signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";

const auth = getAuth();

document.getElementById('email-login').addEventListener('click', () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        sendEmailVerification(user);
        alert('Verification email sent. Please verify your email.');
      } else {
        window.location.href = "dashboard.html";
      }
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
});

document.getElementById('google-login').addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      if (!result.user.emailVerified) {
        sendEmailVerification(result.user);
        alert('Verification email sent. Please verify your email.');
      } else {
        window.location.href = "dashboard.html";
      }
    })
    .catch(error => {
      alert("Google login failed: " + error.message);
    });
});

document.getElementById('facebook-login').addEventListener('click', () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      if (!result.user.emailVerified) {
        sendEmailVerification(result.user);
        alert('Verification email sent. Please verify your email.');
      } else {
        window.location.href = "dashboard.html";
      }
    })
    .catch(error => {
      alert("Facebook login failed: " + error.message);
    });
});
