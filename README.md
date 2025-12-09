# RSVP PWA (INF654)


## Description

This web app is built to demonstrate the features of a Progressive Web Application. A PWA can cache and store data to be used offline, as well as be installed to the home screen of the user's device. This project in particular is an RSVP app. Users can add their name, along with a guest, for a listed event. 
RSVPs are stored in two ways: Firebase when online, and IndexedDB when offline. RSVP-ing creates a database entry. When offline, RSVPs will be stored in IndexedDB and given a placeholder, but will sync with Firebase and be assigned a Firebase ID when back online. The app can then read the data, as demonstrated by the Your RSVPs to this event" section. There is also the ability to edit and delete an entry with the provided buttons. 

## Getting Started

### Viewing the prototype
Download the repository, open the respository in VS Code, and view using Live Server. When the dev branch is merged into the main branch, it can be viewed through GitHub Pages: https://ljeck3.github.io/RSVP-PWA-Prototype/.

### Using the app
When online:
1. Create and log in to an account
1. Navigate to the event. In this case, there is only 1 event called "Party."
2. Fill out the form to "RSVP"
3. Use the buttons next to an entry to edit or delete. 

When Offline:
1. Navigate to the event. In this case, there is only 1 event called "Party."
2. Fill out the form to "RSVP"
3. Use the buttons next to an entry to edit or delete. 
4. When internet is restored, the RSVP will be synced to the account that is signed in to. Reload page to make login buttons reappear again. 

## Authors

Levi Eck

## Acknowledgments

Inspiration, code snippets, etc.
* [Materialize CSS](https://materializecss.com/)
* [dcode](https://www.youtube.com/watch?v=WbbAPfDVqfY)
* ChatGPT for troubleshooting
