initializeFirebase();

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
    showAuth();
    window.location = 'main.html'; //After successful login, user will be redirected to home.html
  }
  else {
    hideAuth();
  }
});

submitButton.onclick = logInUser;
