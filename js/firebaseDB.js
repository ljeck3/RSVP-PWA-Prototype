
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { collection, addDoc, getDocs, deleteDoc,
    doc} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js"
   
  import { getFirestore }  from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
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
  const db = getFirestore (app);

const rsvp = {
    Name: "example RSVP",
    Guest: "example guest,"
};

  //Add a rsvp
export async function addRSVP(rsvp) {
    try {
        const docRef = await addDoc (collection(db, "rsvps"), rsvp);
        return {id: docRef.id, ...rsvp}
    }   catch (error) {
        console.error("error adding rsvp:", error);
    }
}
//Get RSVPS
export async function getRSVP() {
    const rsvps = [];
    try {const querySnapshot = await getDocs(collection(db, "rsvps"))
    querySnapshot.forEach((doc)=>{
        rsvps.push({id: doc.id, ...doc.data()})
    })
    } catch(error) {
        console.error("error retrieving RSVP: ", error);
    }
    return rsvps; 
}

//Delete rsvps
export async function deleteRSVP(id) {
    try {
        await deleteDoc(doc(db, "rsvps", id));
    }   catch (error)
     {
        console.error("error deleting rsvps: ", error);
    }
}

//Update
export async function UpdateRSVP(id, updateData){
    try {
    const rsvpRef = doc(db, "rsvps", id) 
    await updateDOC(rsvpRef, updateData)
    }catch (error) {
    console.error("error updatating RSVP: ", error);
    }

}