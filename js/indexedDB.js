import { openDB } from "https://unpkg.com/idb?module";

//not in use
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
export async function createDB() {
    const db = await openDB("rsvp-app", 1, {
        upgrade(db) {
            // Assign the created object store to a variable 'store'
            const store = db.createObjectStore("rsvps", { keyPath: "id" }); //Got rid of auto increment so that Firebase ID matches IndexedDB ID

            //store.createIndex("status", "status");
            store.createIndex("synced", "synced");
        },
    });
    return db;
}


//Add RSVP
export async function addRSVPoff(rsvp) {
    const db = await createDB();

    //start transation
    const tx = db.transaction("rsvps", "readwrite");
    const store = tx.objectStore("rsvps");

    //add rsvp to store
    await store.add(rsvp);

    //complete transaction
    await tx.done;

    //update storage usage
    checkStorageUsage();
    console.log("RSVP added to IndexedDB");
  }

//Delete RSVP (fixed this 11/19)
export async function deleteRSVPoff(id) {
    const db = await createDB();

    //start transaction
    const tx = db.transaction("rsvps", "readwrite");
    const store = tx.objectStore("rsvps");

    //delete rsvp by id
    await store.delete(id);

    await tx.done;
    console.log("Deleted rsvp from IndexedDB");
}

//Load RSVPs with transaction
export async function getRSVPoff() {
  const db = await createDB()

//start transaction
  const tx = db.transaction("rsvps", "readonly");
  const store = tx.objectStore("rsvps");

//get all rsvps
  const rsvps = await store.getAll();
  return rsvps;
  //await tx.done;
}

//Edit RSVP
export async function updateRSVPoff(id, updateData) {
  const db = await createDB()
  const tx = db.transaction("rsvps", "readwrite");
  const store = tx.objectStore("rsvps");
  await store.put({id, ...updateData, synced: false});
  await tx.done;
}

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
