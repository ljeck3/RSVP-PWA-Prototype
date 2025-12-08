//Initilize---------------------------------
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
//------------------------------------------


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
  deleteRSVPoff,
  updateRSVPoff,
  createDB
}
  from "./indexedDB.js";

//Internet Check
function ihatepayingmyenergybill(){
  if (navigator.onLine) {
    johnnyCash(); //Firebase
  } else {
    billyJoel();   //IndexedDB
  }
}

function isOnline() {
  return navigator.onLine;
}

//Initial load with Firebase or IndexedDB


document.addEventListener('DOMContentLoaded', function() {
  //For Materialize CSS nav bar
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);

// Add RSVP button listener
  const rsvpButton = document.getElementById("rsvpButton");
  if (rsvpButton) {
    rsvpButton.addEventListener("click", rsvpYes);
  }
  
  syncRSVPs();
  ihatepayingmyenergybill()
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

//When users clicks RSVP button
async function rsvpYes() {
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;

    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to RSVP.");
      await window.location.replace("../index.html");
      return;
    }

    const rsvpData = {
      userID: user.uid,
      nameInput: nameInput,
      guestInput: guestInput,
    };

    let savedRSVP;
    if (navigator.onLine) {
      savedRSVP = await addRSVP(rsvpData);
      console.log(savedRSVP)
    } else {
      console.log("No internet. RSVP not added to Firebase.");
      savedRSVP = {
        id: `temp-${Date.now()}`, ...rsvpData, synced: false
      };
        // Save to IndexedDB 
      await addRSVPoff(savedRSVP);
      console.log(savedRSVP);
      alert("RSVP saved locaclly. Your RSVP will sync once internet connection is restored.")
    }

  // Stores Firebase ID for IndexedDB
  //const offlineRSVP = {
    //id: savedRSVP.id,
    //nameInput: nameInput,
    //guestInput: guestInput,
  //};

    //Internet check -> Reload with Firebase or IndexedDB
    ihatepayingmyenergybill();
    }

//Sync unsynced RSVPs from IndexedDB to Firebase
async function syncRSVPs() {
  console.log("Running sync...")
  const db = await createDB();
  const tx = db.transaction("rsvps", "readonly");
  const store = tx.objectStore("rsvps");
  const rsvps = await store.getAll();
  await tx.done;

  for (const rsvp of rsvps) {
    if (!rsvp.synced && isOnline()) {
      try {
        const RSVPToSync = {
        //id: rsvp.id,
        nameInput: rsvp.nameInput,
        guestInput: rsvp.guestInput,
        synced: true
        };
      const savedRSVP = await addRSVP(RSVPToSync);
      const txUpdate = db.transaction("rsvps", "readwrite");
      const storeUpdate = txUpdate.objectStore("rsvps");
      await storeUpdate.delete(rsvp.id);
      await storeUpdate.put({ ...rsvp, id: savedRSVP.id, synced: true });
      await txUpdate.done;
      console.log("synced");
     }catch (error) {
      console.error("Error syncing rsvps", error);
     }
    }
  }
}

//Edit RSVP
async function updateInput(id) {
  //console.log(id); //Check ID
  let nameUpdate = prompt("Edit Name");
  let guestUpdate = prompt("Edit Guest");

  const updateData = {
      nameInput: nameUpdate,
      guestInput: guestUpdate,
    }

  try {
    if (navigator.onLine) {
      await updateRSVP(id, updateData);
      //await updateRSVPoff(id, updateData);
    } else {
      await updateRSVPoff(id, updateData);
      }
  } catch (err) {
    console.error("Error updating RSVP:", err);
  }
  ihatepayingmyenergybill();
}


//TODO: There are repeated parts in billyJoel() and johnnyCash(). Need to consolidate. 


// Load RSVPs from IndexedDB and Display in UI
async function billyJoel() {
  console.log("Internet connection unsuccessful. We didn't start the fire.")
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

// Load RSVPs from Firebase and Display in UI
async function johnnyCash() {
  console.log("Internet connection successful. I fell into a burning ring of fire.")
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