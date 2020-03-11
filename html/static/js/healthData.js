var gender = document.getElementById("gender");
var weight = document.getElementById("weight");
var height = document.getElementById("height");
var age = document.getElementById("age");

var diseases = document.getElementById("diseases");
var toReduce = document.getElementById("toReduce");
var toIncrease = document.getElementById("toIncrease");

var submitButton = document.getElementById("testSubmit");

var fileIn = document.getElementById('fileInput');
var fileOut = document.getElementById('fileOut');

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

var imageSRC = null;

fileIn.onchange = function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    imageSRC = e.target.result;
    fileOut.innerHTML = "File Selected";
  };
  reader.readAsDataURL(this.files[0]);
};

function update() {
  var userId = firebase.auth().currentUser.uid;
  console.log(userId);
  rootUser.child(userId).set({
    gender: gender.value,
    weight: weight.value,
    height: height.value,
    age: age.value,
    diseases: diseases.value,
    to_reduce: toReduce.value,
    to_increase: toIncrease.value
  });
  if (imageSRC != null) {
    
  }
}

function initializeValues() {
  var userId = firebase.auth().currentUser.uid;
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    var dataObj = snapshot.val();

    console.log(snapshot.val());

    gender.value = dataObj["gender"];
    weight.value = parseInt(dataObj["weight"]);
    height.value = parseInt(dataObj["height"]);
    age.value = parseInt(dataObj["age"]);
    diseases.value = dataObj["diseases"];
    toReduce.value = dataObj["to_reduce"];
    toIncrease.value = dataObj["to_increase"];
  });
}

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    showAuth();
    initializeValues();
  }
});

submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  update();
})
