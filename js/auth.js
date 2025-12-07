import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-pL_qpZiIIXDoHPJ2gBn95ciN3_Z6HpQ",
    authDomain: "rsvp-app-1a936.firebaseapp.com",
    projectId: "rsvp-app-1a936",
    storageBucket: "rsvp-app-1a936.firebasestorage.app",
    messagingSenderId: "999513284303",
    appId: "1:999513284303:web:f6123f0a7b25d29b8061ba"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);


//Register-------------------------
document.getElementById("registerButton").addEventListener("click", registerUser);

function registerUser() {

  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;

  console.log(email, password);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else {
        alert(err.message);
      }
    });
}
//------------------------------------------