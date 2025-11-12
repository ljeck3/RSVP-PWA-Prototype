//takes functions from firebaseDB.js to be used here. 
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
    getRSVPData() //Reloads the RSVP list so page does not have to be refreshed
}
/*
// Load Tasks from Firebase and Display in UI
async function loadTasks() {
  const tasks = await getTasksFromFirebase();
  const taskContainer = document.querySelector(".tasks");
  taskContainer.innerHTML = ""; // Clear current tasks
  tasks.forEach((task) => {
    displayTask(task);
  });
}
*/


// Load RSVPs from Firebase and Display in UI
async function getRSVPData() {
  const rsvps = await getRSVP();
  console.log(rsvps); //test to see if getting data

  const rsvpList = document.getElementById("rsvp-list");
  rsvpList.innerHTML = ""; // Clears previous items

  rsvps.forEach(rsvp => {
    const li = document.createElement("li");
    li.textContent = `Name: ${rsvp.nameInput} | Guest: ${rsvp.guestInput}`;
    rsvpList.appendChild(li);
  });
}

getRSVPData() //Loads the initial RSVPs before changes are made

window.rsvpYes = rsvpYes