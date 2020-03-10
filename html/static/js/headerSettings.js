var profileImage = document.getElementById("profileImg");
var auth = document.getElementById('auth');
var notauth = document.getElementById('notauth');

var signout = document.getElementById("signout");

function hideAuth() {
  notauth.style.display = "block";
  auth.style.display = "none";
}
function showAuth() {
  auth.style.display = "block";
  notauth.style.display = "none";
}

function signOut() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    hideAuth();
    window.location = "/index.html"
  }).catch(function(error) {
    window.alert(error.message);
    // An error happened.
  });
}

signout.onclick = signOut;
