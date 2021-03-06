initializeFirebase();

var email = document.getElementById("email");
var password = document.getElementById("password");
var submitButton = document.getElementById("submitButton");

function logInUser() {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(auth => {
    showAuth();
    window.location = 'main.html';
  }).catch(error => {
    alert(error.message);
  });
}

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    showAuth();
    window.location = 'main.html';
  }
  else {
    hideAuth();
  }
});

submitButton.onclick = logInUser;
