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

var email = document.getElementById("email");
var password = document.getElementById("password");
var submitButton = document.getElementById("submitButton");

function logInUser() {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(auth => {
  }).catch(error => {
    alert(error.message);
  });
}

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    window.location = 'main.html'; //After successful login, user will be redirected to home.html
  }
});

submitButton.onclick = logInUser;
