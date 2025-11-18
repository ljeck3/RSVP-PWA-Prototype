import { openDB } from "https://unpkg.com/idb?module";


//takes functions from firebaseDB.js to be used here. 
import {
  addRSVP,
  getRSVP,
  deleteRSVP,
  updateRSVP
} from "./firebaseDB.js"

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("SW Registered!");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed!");
        console.log(error);
    });
}

// create indexDB databse
async function createDB() {
    const db = await openDB("rsvp-app", 1, {
        upgrade(db) {
            const store = db.createObjectStore("rsvps", {
                keyPath: "id",
                autoIncrement: true,
            });
            store.createIndex("status", "status");
            store.createIndex("synced", "synced");
        },
    });
    return db;
}

// Add RSVP
// async function addRSVP(RSVP) {
//     const db = await createDB();
    
//     // start transaction
//     const tx = db.transaction("RSVPs", "readwrite");
//     const store = tx.objectStore("RSVPs");

//     //Add RSVP to store
//     await store.add(rsvp);

//     //Complete transation
//     await tx.done;

//     //update storage usage
//     checkStorageUsage(); 
// }

//Delete RSVP
// async function deleteRSVP(id) {
//     const db = await createDB();

//     //start transation
//     const tx = db.transaction("tasks", "readwrite");
//     const store = tx.objectStore("RSVPs");

//     //delete task by id
//     await store.delete(id);

//     await tx.done;
    
//     //Remove task from UI
//     const rsvpCard = document.querySelector(`[data-id="${id}"]`);
//     if(rsvpCard){}{
//         rsvpCard.remove()
//         }

//     //update storage usage
//     checkStorageUsage(); 
// }

//Load RSVPs with transaction
async function addRSVPs(rsvp) {
    const db = await createDB();
    let rsvpID

    if (navigator.onLine) {
      const savedRSVP = await addRSVP(rsvp);
      rsvpID = savedRSVP.id;
    

//start transation
    const tx = db.transaction("tasks", "readwrite");
    const store = tx.objectStore("rsvps");
    await store.put({...rsvp, id: rsvpID, synced: true});
    await tx.done;
    } else {
      //offline
      rsvpID = `temp-${Date.now()}`;

      //check if rsvpID is valid before adding to indexedDB
      const rsvpToStore = {...rsvp, id: rsvpID, synced: false};
      if (!rsvpToStore.id) {
        console.error("Failed to generate a valid ID for the rsvp");
        return; 
      }

    const tx = db.transaction("tasks", "readwrite");
    const store = tx.objectStore("RSVPs");
    await store.put(rsvpToStore);
    await tx.done;

    }

    checkStorageUsage();

    //return rsvp with id
    return {...rsvp, id: rsvpID};
  }


//delete, display, load synctasks



//Get all RSVPs
const rsvps = await store.getAll();

await tx.done;

const rsvpContainer = document.querySelector(".tasks");
rsvpContainer.innerHTML = "";
rsvp.forEach((task) => {
    displayRSVP(rsvp);
    });

//Display rsvp using the existing HTMl structure/Attach delete event listener/Add RSVP Button listener 


//Did not understand how to do these steps in my case


// Function to check storage usage


async function checkStorageUsage() {
  if (navigator.storage && navigator.storage.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    const usageInMB = (usage / (1024 * 1024)).toFixed(2); // Convert to MB
    const quotaInMB = (quota / (1024 * 1024)).toFixed(2); // Convert to MB

    console.log(`Storage used: ${usageInMB} MB of ${quotaInMB} MB`);

    // Update the UI with storage info
    const storageInfo = document.querySelector("#storage-info");
    if (storageInfo) {
      storageInfo.textContent = `Storage used: ${usageInMB} MB of ${quotaInMB} MB`;
    }

    // Warn the user if storage usage exceeds 80%
    if (usage / quota > 0.8) {
      const storageWarning = document.querySelector("#storage-warning");
      if (storageWarning) {
        storageWarning.textContent =
          "Warning: You are running low on storage space. Please delete old tasks to free up space.";
        storageWarning.style.display = "block";
      }
    } else {
      const storageWarning = document.querySelector("#storage-warning");
      if (storageWarning) {
        storageWarning.textContent = "";
        storageWarning.style.display = "none";
      }
    }
  }
}

// Function to request persistent storage
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersistent = await navigator.storage.persist();
    console.log(`Persistent storage granted: ${isPersistent}`);

    // Update the UI with a message
    const storageMessage = document.querySelector("#persistent-storage-info");
    if (storageMessage) {
      if (isPersistent) {
        storageMessage.textContent =
          "Persistent storage granted. Your data is safe!";
        storageMessage.classList.remove("red-text");
        storageMessage.classList.add("green-text");
      } else {
        storageMessage.textContent =
          "Persistent storage not granted. Data might be cleared under storage pressure.";
        storageMessage.classList.remove("green-text");
        storageMessage.classList.add("red-text");
      }
    }
  }
}
