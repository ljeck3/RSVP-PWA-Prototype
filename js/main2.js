//TODO: Sync function

//takes functions from firebaseDB.js to be used here. 
import {
  addRSVP,
  getRSVP,
  deleteRSVP,
  updateRSVP
} from "./firebaseDB.js"

//takes functions from IndexedDB.js to be used here. 
import {
  addRSVPoff,
  getRSVPoff,
  deleteRSVPoff
}
  from "./indexedDB.js";

//Internet Check
if (navigator.onLine) {
  bigChungus(); //Firebase
} else {
  johnPork();   //IndexedDB
}

document.addEventListener('DOMContentLoaded', function() {
  //For Materialize CSS nav bar
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);

// Add RSVP button listener
  const rsvpButton = document.getElementById("rsvpButton");
  if (rsvpButton) {
    rsvpButton.addEventListener("click", fazbearEntertainment);
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

  //Reloads the RSVP list from Firebase
  bigChungus() //Firebase
  johnPork() //IndexedDB
}

async function fazbearEntertainment() {
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

    //Reloads the RSVP list so page does not have to be refreshed
    bigChungus(); //Firebase
    johnPork(); //IndexedDB
}


//TODO: There are repeated parts in johnPork() and bigChungus(). Need to consolidate. 



// Load RSVPs from IndexedDB and Display in UI
async function johnPork() {
  console.log("Internet connection unsuccessful. Calling John Pork.")
  const rsvps = await getRSVPoff();
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
        //await deleteRSVP(rsvp.id); //Runs function in firebaseDB.js to delete from Firebase.
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

window.fazbearEntertainment = fazbearEntertainment //Makes this function global so that it can run in html inline.