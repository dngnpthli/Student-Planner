import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getDatabase, ref, set} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js'

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDbdNpYFXtIzRQPDD3bkElqivaE77J8cgY",
  authDomain: "studentplanner-f854b.firebaseapp.com",
  databaseURL: "https://studentplanner-f854b-default-rtdb.firebaseio.com",
  projectId: "studentplanner-f854b",
  storageBucket: "studentplanner-f854b.appspot.com",
  messagingSenderId: "767193918122",
  appId: "1:767193918122:web:96ed60b5553769bd3abed3",
});

const getData = async () => {

  registerUser(fname.value, lname.value, idnum.value, grade.value, strand.value, email.value, pass.value,);

}

function registerUser(fname, lname, idnum, grade, strand, email, pass){
  const db = getDatabase();
  set(ref(db, 'students/' + email), {
    studentEmail: email,
    firstname: fname,
    lastname: lname,
    idnumber: idnum,
    strand: strand,
    gradelevel: grade,
    password: pass
  })
  .then(function() {
    var Email = email;
    console.log(Email);
    localStorage.setItem("email", Email);
    window.location.href = "login.html";
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

btnRegister.addEventListener("click", getData);