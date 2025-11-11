import {
  addRSVP,
  getRSVP,
  deleteRSVP
} from "./firebaseDB.js"

//For Materialize CSS nav bar
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered!");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed!");
        console.log(error);
    });
}

function rsvpYes() {
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;

    const rsvpData = {
      nameInput: nameInput,
      guestInput: guestInput,
    }

    console.log(rsvpData)
    const savedRSVP = addRSVP(rsvpData)
    fetch("https://script.google.com/macros/s/AKfycbxOheWBesYVx6k_SKqZT0kCLMw7pDkfLscQtc2BSm8svUZnLkz87viyiBgOIkLFji1H/exec", {
    method: "POST",
    body: JSON.stringify({ 
        name: nameInput, 
        guest: guestInput,
        yes: "X",
        no: ""
        })
    })
}

window.rsvpYes = rsvpYes