const firebaseApp = {
    apiKey: "AIzaSyAT3IkIdZfoTQ_WWlMo9WjB87_hEZ9H7s8",
    authDomain: "pwc-studentplanner-system.firebaseapp.com",
    databaseURL: "https://pwc-studentplanner-system-default-rtdb.firebaseio.com",
    projectId: "pwc-studentplanner-system",
    storageBucket: "pwc-studentplanner-system.appspot.com",
    messagingSenderId: "567680897211",
    appId: "1:567680897211:web:9dc86820eb1782a90c199e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const loginButton = document.getElementById("btnLogin");
    loginButton.addEventListener("click", () => {
      const usernameField = document.getElementById("username");
      const passwordField = document.getElementById("password");
      const username = usernameField.value;
      const password = passwordField.value;
      
      firebase.auth().signInWithEmailAndPassword(username, password)
      .then((userCredential) => {
        // Signed in
        location.href = "index.html";
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Invalid username or password',
          text: 'Please try again!',
        });
      });
    });