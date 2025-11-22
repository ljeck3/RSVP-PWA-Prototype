//takes functions from firebaseDB.js to be used here. 
import {
  addRSVP,
  getRSVP,
  deleteRSVP,
  updateRSVP
} from "./firebaseDB.js"

import {
  addRSVPoff,
  getRSVPoff,
  deleteRSVPoff
}
  from "./indexedDB.js";

//Internet Check
if (navigator.onLine) {
  bigChungus(); // load Firebase
} else {
  johnPork();   // load IndexedDB
}

//For Materialize CSS nav bar
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);

// Add RSVP button listener
  const rsvpButton = document.getElementById("rsvpButton");
  if (rsvpButton) {
    rsvpButton.addEventListener("click", rsvpYes);
  }

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

async function updateInput(id) {
  let nameUpdate = prompt("Edit Name");
  let guestUpdate = prompt("Edit Guest");

  const updateData = {
      nameInput: nameUpdate,
      guestInput: guestUpdate,
    }

  console.log(nameUpdate)
  console.log(guestUpdate)
  await updateRSVP(id, updateData); 
  bigChungus() //Reloads the RSVP list from Firebase
  johnPork() //reloads the RSVP list from IndexedDB
}

async function rsvpYes() {
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;

    const rsvpData = {
      nameInput: nameInput,
      guestInput: guestInput,
    }

    console.log(rsvpData)
    const savedRSVP = await addRSVP(rsvpData);


    // Stores Firebase ID for IndexedDB
  const offlineRSVP = {
    id: savedRSVP.id,
    nameInput: nameInput,
    guestInput: guestInput,
  };

  // Save to IndexedDB 
  await addRSVPoff(offlineRSVP);

    bigChungus() //Reloads the RSVP list so page does not have to be refreshed
    johnPork()
}

async function johnPork() { //This runs a function in another file to handle loading from indexeddb
  console.log("Internet connection unsuccessful. Calling John Pork.")
  getRSVPoff();
}

// Load RSVPs from Firebase and Display in UI
async function bigChungus() {
  console.log("Internet connection successful. Loading Big Chungus for the PS4.")
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
    //update button
    const updateButton = document.createElement("button")
    updateButton.textContent = "edit"
    
    deleteButton.addEventListener("click", async () => {
      await deleteRSVP(rsvp.id); //Runs function in firebaseDB.js to delete from Firebase.
      await deleteRSVPoff(rsvp.id);//Runs function in indexedDB.js to delete from Indexeddb (fixed this 11/19).
      li.remove();
      deleteButton.remove();
    })

    updateButton.addEventListener("click", async () => {
      await updateInput(rsvp.id); //triggers update functionality 
    })
    
    li.appendChild(updateButton); //Puts button inside li
    li.appendChild(deleteButton); //Puts button inside li
    rsvpList.appendChild(li); //buttons now inside li, which goes into ul.
    
  });
}

window.rsvpYes = rsvpYes //Makes this function global so that it can run in html inline.