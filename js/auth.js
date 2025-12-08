import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
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


// Register button
const registerBtn = document.getElementById("registerButton");
if (registerBtn) {
  registerBtn.addEventListener("click", registerUser);
}

// Login button
const loginBtn = document.getElementById("loginButton");
if (loginBtn) {
  loginBtn.addEventListener("click", loginUser);
}

//Register-------------------------
function registerUser() {

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      window.location.replace("../index.html");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else {
        alert(error.message);
      }
    });
}
//Login-------------------------
function loginUser() {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  console.log(email, password);

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      window.location.replace("../index.html");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
//Get signed-in user-------------------------
function currentUser() {
  onAuthStateChanged(auth, (user) => {
     const parentElement = document.getElementById("user-container")

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    //alert(user.email);
    parentElement.textContent = `Welcome, ${user.email}`; //Displays logged in user

    const allowLogout = document.createElement("button"); //Creates logout button
    allowLogout.textContent = "Logout";
    allowLogout.id ="logoutButton";
    allowLogout.classList.add(
      "waves-effect",
      "waves-light",
      "btn",
      "red",
      "darken-1"
    );
    allowLogout.addEventListener("click", goodbyeUser); //For signing out
    parentElement.appendChild(allowLogout);
  } else {
    // User is signed out
    // ...
  }
});

}
//Sign-out user-------------------------
async function goodbyeUser() {
  signOut(auth).then(() => {
    alert("byyyeee");
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
await location.reload();
}

currentUser(); //gets current user when page is loaded