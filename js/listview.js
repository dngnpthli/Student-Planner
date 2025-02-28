import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, get, child, remove} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT3IkIdZfoTQ_WWlMo9WjB87_hEZ9H7s8",
  authDomain: "pwc-studentplanner-system.firebaseapp.com",
  databaseURL: "https://pwc-studentplanner-system-default-rtdb.firebaseio.com",
  projectId: "pwc-studentplanner-system",
  storageBucket: "pwc-studentplanner-system.appspot.com",
  messagingSenderId: "567680897211",
  appId: "1:567680897211:web:9dc86820eb1782a90c199e"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const dbref = ref(database);
let emailadd = "";
let idno = "";

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('DOMContentLoaded event fired');
    const listContainer = document.getElementById('list-view');

    auth.onAuthStateChanged((user) => {
      if (user) {
        emailadd = user.email;
        getIdNo(emailadd);
      } else {
        console.log("No user is currently signed in.");
      }
    });

    function getIdNo(emailadd){
      
      const regex = /@/;
      const [first, second] = emailadd.split(regex);
      get(child(dbref, `emailadds/${first}`)).then((snapshot) => {

        if(snapshot.exists()){
          idno = snapshot.val();
          console.log("ID No. is: "+idno);
          getClassScheduleData();
          getEventScheduleData();
        }
        else{
          console.log("On failed getIdNo(ProfileView): No Data Available");
        }
      }).catch((error) =>{
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to retrieve profile details.',
          });
      });
    }

    function populateClassScheduleList(classScheduleData) {
        const classScheduleList = document.getElementById('class-schedule-list');
        classScheduleList.innerHTML = '';
        classScheduleData.forEach(schedule => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            listItem.innerHTML = 
            `<button class="task-button delete-button" data-key="${schedule.key}" data-type="class">
                <p class="task-name"><strong>${schedule.title}</strong></p>
                <p class="task-due-date">Classes starts/ed on <i>${schedule.dueDate}</i></p>
                <p class="task-due-date"><i>Every ${schedule.day}, at ${schedule.time}</i></p>
                <iconify-icon
                  icon="material-symbols:arrow-back-ios-rounded"
                  style="color: black"
                  width="18"
                  height="18"
                  class="arrow-icon">
                </iconify-icon>
             </button>`;
            classScheduleList.appendChild(listItem);
        });
    }

    function getClassScheduleData() {
        const userIDnum = idno;
        console.log(userIDnum);
        const classScheduleRef = ref(database, `students/${userIDnum}/class`);
        
        get(classScheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
                const classScheduleData = [];
                snapshot.forEach((childSnapshot) => {
                    const schedule = childSnapshot.val();
                    schedule.key = childSnapshot.key;
                    classScheduleData.push(schedule);
                });
                populateClassScheduleList(classScheduleData);
            } else {
                console.log('No class schedule data available');
            }
        }).catch((error) => {
            console.error('Error retrieving class schedule data:', error);
        });
    }

    function populateEventScheduleList(classScheduleData) {
        const classScheduleList = document.getElementById('event-schedule-list');
        classScheduleList.innerHTML = '';
        classScheduleData.forEach(schedule => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            listItem.innerHTML = 
            `<button class="task-button delete-button" data-key="${schedule.key}" data-type="event">
                <p class="task-name"><strong>${schedule.title}</strong></p>
                <p class="task-due-date"><i>Scheduled on ${schedule.dueDate}, ${schedule.day}</i></p>
                <p class="task-due-date"><i>Event starts at exactly ${schedule.time}</i></p>
                <iconify-icon
                  icon="material-symbols:arrow-back-ios-rounded"
                  style="color: black"
                  width="18"
                  height="18"
                  class="arrow-icon">
                </iconify-icon>
             </button>`;
            classScheduleList.appendChild(listItem);
        });
    }

    function getEventScheduleData() {
        const userIDnum = idno;
        console.log(userIDnum);
        const classScheduleRef = ref(database, `students/${userIDnum}/event`);
        
        get(classScheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
                const classScheduleData = [];
                snapshot.forEach((childSnapshot) => {
                    const schedule = childSnapshot.val();
                    schedule.key = childSnapshot.key;
                    classScheduleData.push(schedule);
                });
                populateEventScheduleList(classScheduleData);
            } else {
                console.log('No class schedule data available');
            }
        }).catch((error) => {
            console.error('Error retrieving class schedule data:', error);
        });
    }

    function deleteSchedule(schedule, type) {
      const userIDnum = idno;
      const schedType = type;
      const parent = schedule

      console.log(userIDnum);
      console.log(schedType);
      console.log(parent);

      const scheduleRef = ref(database, `students/${userIDnum}/${type}/${parent}`);
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this schedule. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
          if (result.isConfirmed) {
            remove(scheduleRef).then(() => {
            console.log('Schedule deleted successfully');
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The schedule has been deleted.',
              timer: 3000,
              showConfirmButton: false
            }).then(() => {
                window.location.reload();
            });
            }).catch((error) => {
              console.error('Error deleting schedule:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the schedule. Please try again later.',
                timer: 2000,
                showConfirmButton: false
              });
            });
          }
        });
    }

    listContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-button')) {
        const key = event.target.getAttribute('data-key');
        const type = event.target.getAttribute('data-type');
        deleteSchedule(key, type);
      }
    });
});