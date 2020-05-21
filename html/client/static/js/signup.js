var submitButton = document.getElementById("testSubmit");

hideAuth();

initializeFirebase();

var database = firebase.database();
var rootUser = database.ref("users");

function signUpUser() {
  firebase.auth().createUserWithEmailAndPassword(email.value, pword.value).then(auth => {
    console.log("we signed up");
    showAuth();
  }).catch(error => {
    alert(error.message);
  })
}

firebase.auth().onAuthStateChanged(user => {
  console.log("state changed");
  if(user) {
    console.log("if (user)");
    console.log(user.uid);
    rootUser.child(user.uid).set({
      gender: "",
      weight: "",
      height: "",
      age: "",
      diseases: "",
      to_reduce: "",
      to_increase: ""
    });
    window.location = 'main.html';
  }
});


submitButton.onclick = function(e) {
  e.preventDefault();
  if (pword.value === confirmpword.value) {
    signUpUser();
  }
}
