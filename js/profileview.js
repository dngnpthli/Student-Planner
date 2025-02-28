import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAT3IkIdZfoTQ_WWlMo9WjB87_hEZ9H7s8",
    authDomain: "pwc-studentplanner-system.firebaseapp.com",
    databaseURL: "https://pwc-studentplanner-system-default-rtdb.firebaseio.com",
    projectId: "pwc-studentplanner-system",
    storageBucket: "pwc-studentplanner-system.appspot.com",
    messagingSenderId: "567680897211",
    appId: "1:567680897211:web:9dc86820eb1782a90c199e"
});

const database = getDatabase(firebaseApp);
const userRef = ref(database, 'students');

// Function to populate input fields with user data
function populateUserData(userData) {
    let profileName = "";
    if (userData.firstname && userData.lastname) {
        profileName = `${userData.firstname} ${userData.lastname}`;
        if (userData.middlename) {
            profileName += ` ${userData.middlename.charAt(0)}.`;
        }
    }
    document.querySelector('#profileName').value = profileName || "";
    document.querySelector('#studentID').value = userData.idnum || " ";
    document.querySelector('#section').value = userData.section || "";
    document.querySelector('#grade').value = userData.gradelevel || "";
    document.querySelector('#strand').value = userData.strand || "";
    document.querySelector('#address').value = userData.address || "";
    document.querySelector('#email').value = userData.email || "";
}

// Firebase Authentication state change listener
onAuthStateChanged(getAuth(firebaseApp), (user) => {
    if (user) {
        const userId = user.uid;
        const userRef = ref(database, `students`);
        
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                populateUserData(userData); // Call the function to populate input fields
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    } else {
        console.log("User not logged in");
        // Redirect or handle case where user is not logged in
    }
});