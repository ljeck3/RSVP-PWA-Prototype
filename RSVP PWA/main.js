function rsvpYes() {
    console.log("Yes function ran")
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;
    console.log(nameInput)
    console.log(guestInput)

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

function rsvpNo() {
    console.log("Yes function ran")
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;
    console.log(nameInput)
    console.log(guestInput)


    fetch("https://script.google.com/macros/s/AKfycbxOheWBesYVx6k_SKqZT0kCLMw7pDkfLscQtc2BSm8svUZnLkz87viyiBgOIkLFji1H/exec", {
    method: "POST",
    body: JSON.stringify({ 
        name: nameInput, 
        guest: guestInput,
        yes: "",
        no: "X"
        })
    })
}


