import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, set, ref, get, child, remove} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

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
    const listContainer = document.getElementById('board-view');

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
          getToDoData();
          getDoingData();
          getDoneData();
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

    function populateToDoList(classScheduleData) {
        const classScheduleList = document.getElementById('tasks-list pink');
        classScheduleList.innerHTML = '';
        classScheduleData.forEach(schedule => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            listItem.innerHTML = 
            `<button class="task-button doing-button" data-key="${schedule.key}" data-type="todo">
                <p class="task-name"><strong>${schedule.title}</strong></p>
                <p class="task-due-date">Due on <i>${schedule.dueDate}<br>Your task is to ${schedule.details}</i></p>
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

    function getToDoData() {
        const userIDnum = idno;
        console.log("on getToDo: "+userIDnum);
        const classScheduleRef = ref(database, `students/${userIDnum}/tasks/todo`);
        
        get(classScheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
                const classScheduleData = [];
                snapshot.forEach((childSnapshot) => {
                    const schedule = childSnapshot.val();
                    schedule.key = childSnapshot.key;
                    classScheduleData.push(schedule);
                });
                populateToDoList(classScheduleData);
            } else {
                console.log('No class schedule data available');
            }
        }).catch((error) => {
            console.error('Error retrieving class schedule data:', error);
        });
    }

    function populateDoingList(classScheduleData) {
        const classScheduleList = document.getElementById('tasks-list blue');
        classScheduleList.innerHTML = '';
        classScheduleData.forEach(schedule => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            listItem.innerHTML = 
            `<button class="task-button done-button" data-key="${schedule.key}" data-type="doing">
                <p class="task-name"><strong>${schedule.title}</strong></p>
                <p class="task-due-date">Due on <i>${schedule.dueDate}<br>Your task is to ${schedule.details}</i></p>
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

    function getDoingData() {
        const userIDnum = idno;
        console.log("on getDoing: "+userIDnum);
        const classScheduleRef = ref(database, `students/${userIDnum}/tasks/doing`);
        
        get(classScheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
                const classScheduleData = [];
                snapshot.forEach((childSnapshot) => {
                    const schedule = childSnapshot.val();
                    schedule.key = childSnapshot.key;
                    classScheduleData.push(schedule);
                });
                populateDoingList(classScheduleData);
            } else {
                console.log('No class schedule data available');
            }
        }).catch((error) => {
            console.error('Error retrieving class schedule data:', error);
        });
    }               

    function populateDoneList(classScheduleData) {
        const classScheduleList = document.getElementById('tasks-list green');
        classScheduleList.innerHTML = '';
        classScheduleData.forEach(schedule => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            listItem.innerHTML = 
            `<button class="task-button delete-button" data-key="${schedule.key}" data-type="done">
                <p class="task-name"><strong>${schedule.title}</strong></p>
                <p class="task-due-date">Due on <i>${schedule.dueDate}<br>Your task is to ${schedule.details}</i></p>
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

    function getDoneData() {
        const userIDnum = idno;
        console.log("on getDone: "+userIDnum);
        const classScheduleRef = ref(database, `students/${userIDnum}/tasks/done`);
        
        get(classScheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
                const classScheduleData = [];
                snapshot.forEach((childSnapshot) => {
                    const schedule = childSnapshot.val();
                    schedule.key = childSnapshot.key;
                    classScheduleData.push(schedule);
                });
                populateDoneList(classScheduleData);
            } else {
                console.log('No class schedule data available');
            }
        }).catch((error) => {
            console.error('Error retrieving class schedule data:', error);
        });
    }

    function deleteToDo(schedule, type) {
      const userIDnum = idno;
      const parent = schedule;
      const originalPath = `students/${userIDnum}/tasks/${type}/${parent}`;
      const doingPath = `students/${userIDnum}/tasks/doing/${parent}`;

      console.log(userIDnum);
      console.log(parent);

      const scheduleRef = ref(database, originalPath);
      const doingRef = ref(database, doingPath);

      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to move this task to DOING. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Retrieve the schedule data before moving it to doing
          get(scheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
              // Get the schedule data
              const scheduleData = snapshot.val();
              // Set the schedule data in the doingRef
              set(doingRef, scheduleData).then(() => {
                console.log('Task moved to DOING successfully');
                // Remove the schedule data from the original path
                remove(scheduleRef).then(() => {
                  console.log('Task deleted successfully');
                  Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'The schedule has been moved to DOING.',
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
              }).catch((error) => {
                console.error('Error moving schedule to DOING:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'Failed to move the schedule to DOING. Please try again later.',
                  timer: 2000,
                  showConfirmButton: false
                });
              });
            } else {
              console.log('Schedule data not found');
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Schedule data not found. Unable to move to DOING.',
                timer: 2000,
                showConfirmButton: false
              });
            }
          }).catch((error) => {
            console.error('Error retrieving schedule data:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to retrieve schedule data. Please try again later.',
              timer: 2000,
              showConfirmButton: false
            });
          });
        }
      });
    }

    function deleteDoing(schedule, type) {
      const userIDnum = idno;
      const parent = schedule;
      const originalPath = `students/${userIDnum}/tasks/${type}/${parent}`;
      const doingPath = `students/${userIDnum}/tasks/done/${parent}`;

      console.log(userIDnum);
      console.log(parent);

      const scheduleRef = ref(database, originalPath);
      const doingRef = ref(database, doingPath);

      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to move this task to DONE. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Retrieve the schedule data before moving it to doing
          get(scheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
              // Get the schedule data
              const scheduleData = snapshot.val();
              // Set the schedule data in the doingRef
              set(doingRef, scheduleData).then(() => {
                console.log('Task moved to DONE successfully');
                // Remove the schedule data from the original path
                remove(scheduleRef).then(() => {
                  console.log('Task deleted successfully');
                  Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'The schedule has been moved to DONE.',
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
              }).catch((error) => {
                console.error('Error moving schedule to DOING:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'Failed to move the schedule to DOING. Please try again later.',
                  timer: 2000,
                  showConfirmButton: false
                });
              });
            } else {
              console.log('Schedule data not found');
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Schedule data not found. Unable to move to DOING.',
                timer: 2000,
                showConfirmButton: false
              });
            }
          }).catch((error) => {
            console.error('Error retrieving schedule data:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to retrieve schedule data. Please try again later.',
              timer: 2000,
              showConfirmButton: false
            });
          });
        }
      });
    }

    function deleteDone(schedule, type) {
      const userIDnum = idno;
      const parent = schedule;
      const originalPath = `students/${userIDnum}/tasks/${type}/${parent}`;
      const doingPath = `students/${userIDnum}/tasks/done/${parent}`;

      console.log(userIDnum);
      console.log(parent);

      const scheduleRef = ref(database, originalPath);
      const doingRef = ref(database, doingPath);

      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to move this task to DONE. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Retrieve the schedule data before moving it to doing
          get(scheduleRef).then((snapshot) => {
            if (snapshot.exists()) {
              // Get the schedule data
              const scheduleData = snapshot.val();
              // Set the schedule data in the doingRef
              set(doingRef, scheduleData).then(() => {
                console.log('Task moved to DONE successfully');
                // Remove the schedule data from the original path
                remove(scheduleRef).then(() => {
                  console.log('Task deleted successfully');
                  Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'The schedule has been moved to DONE.',
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
              }).catch((error) => {
                console.error('Error moving schedule to DOING:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'Failed to move the schedule to DOING. Please try again later.',
                  timer: 2000,
                  showConfirmButton: false
                });
              });
            } else {
              console.log('Schedule data not found');
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Schedule data not found. Unable to move to DOING.',
                timer: 2000,
                showConfirmButton: false
              });
            }
          }).catch((error) => {
            console.error('Error retrieving schedule data:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to retrieve schedule data. Please try again later.',
              timer: 2000,
              showConfirmButton: false
            });
          });
        }
      });
    }

    listContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('doing-button')) {
        const key = event.target.getAttribute('data-key');
        const type = event.target.getAttribute('data-type');
        deleteToDo(key, type);
      }
      else if(event.target.classList.contains('done-button')) {
        const key = event.target.getAttribute('data-key');
        const type = event.target.getAttribute('data-type');
        deleteDoing(key, type);
      }
    });

    listContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-button')) {
        const key = event.target.getAttribute('data-key');
        const type = event.target.getAttribute('data-type');
        deleteDone(key, type);
      }
    });
});