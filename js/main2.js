//takes functions from firebaseDB.js to be used here. 
import {
  addRSVP,
  getRSVP,
  deleteRSVP
} from "./firebaseDB.js"

getRSVPData() //Loads the initial RSVPs before changes are made

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

// Load RSVPs from Firebase and Display in UI
async function getRSVPData() {
  const rsvps = await getRSVP();
  console.log(rsvps); //test to see if getting data

  const rsvpList = document.getElementById("rsvp-list");
  rsvpList.innerHTML = ""; // Clears previous items

  rsvps.forEach(rsvp => {
    const li = document.createElement("li");
    li.textContent = `${rsvp.nameInput} & ${rsvp.guestInput}`;
    
    //delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    
    deleteButton.addEventListener("click", async () => {
      await deleteRSVP(rsvp.id); //Runs function in firebaseDB.js to delete from Firebase.
      li.remove();
      deleteButton.remove();
    })
    li.appendChild(deleteButton); //Puts button inside li
    rsvpList.appendChild(li); //button now inside li, so as a whole, li goes into ul.
    
  });
}

window.rsvpYes = rsvpYes //Makes this function global so that it can run in html inline.