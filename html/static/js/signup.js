var email = document.getElementById("email");
var username = document.getElementById("username");
var pword = document.getElementById("pword");
var gender = document.getElementById("gender");
var weight = document.getElementById("weight");
var height = document.getElementById("height");
var age = document.getElementById("age");

var diseases = document.getElementById("diseases");
var toReduce = document.getElementById("toReduce");
var toIncrease = document.getElementById("toIncrease");

var submitButton = document.getElementById("testSubmit");

var firebaseConfig = {
  apiKey: "AIzaSyC6BBIddvML8T57p5wRnM66Bh2iPCLJayM",
  authDomain: "advanced-dieting.firebaseapp.com",
  databaseURL: "https://advanced-dieting.firebaseio.com",
  projectId: "advanced-dieting",
  storageBucket: "advanced-dieting.appspot.com",
  messagingSenderId: "1040427605146",
  appId: "1:1040427605146:web:951764d0785b5292f89323",
  measurementId: "G-KD9YWTH1CS"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var rootUser = database.ref("users");

function signUpUser() {
  firebase.auth().createUserWithEmailAndPassword(email.value, pword.value).then(auth => {
    console.log("we signed up");
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


submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  signUpUser();
})
