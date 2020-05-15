var email = document.getElementById("email");
var username = document.getElementById("username");
var pword = document.getElementById("pword");
var confirmpword = document.getElementById("confirmpword");
var gender = document.getElementById("gender");
var weight = document.getElementById("weight");
var height = document.getElementById("height");
var age = document.getElementById("age");

var diseases = document.getElementById("diseases");
var toReduce = document.getElementById("toReduce");
var toIncrease = document.getElementById("toIncrease");

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
      gender: gender.value,
      weight: weight.value,
      height: height.value,
      age: age.value,
      diseases: diseases.value,
      to_reduce: toReduce.value,
      to_increase: toIncrease.value
    });
  }
});


submitButton.onclick = function(e) {
  e.preventDefault();
  if (pword.value === confirmpword.value) {
    signUpUser();
  }
}
