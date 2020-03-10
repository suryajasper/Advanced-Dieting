var profileImage = document.getElementById("profileImg");
var auth = document.getElementById('auth');
var notauth = document.getElementById('notauth');

function hideAuth() {
  notauth.style.display = "block";
  auth.style.display = "none";
}
function showAuth() {
  auth.style.display = "block";
  notauth.style.display = "none";
}
