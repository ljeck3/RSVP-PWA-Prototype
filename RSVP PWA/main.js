function rsvpYes() {
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;

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
    const nameInput = document.getElementById("nameInput").value;
    const guestInput = document.getElementById("guestInput").value;

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


//For Materialize CSS nav bar
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

