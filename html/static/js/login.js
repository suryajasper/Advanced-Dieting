/*(function(){

  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '404.html',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);

})()
*/

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

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}


function signUpUser() {
  firebase.auth().createUserWithEmailAndPassword(email.value, pword.value).then(auth => {
    rootUser.child(username.value).set({
      gender: gender.value,
      weight: weight.value,
      height: height.value,
      age: age.value,
      diseases: diseases.value,
      to_reduce: toReduce.value,
      to_increase: toIncrease.value
    });
    console.log("aweofij");
  }).catch(error => {
    console.log(error.message);
  })
}

submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  signUpUser();
})
