var app_firebase = {};
(function(){
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

  app_firebase = firebase;
})()
