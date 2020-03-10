var lineChart = document.getElementById("lineChart")
var pieChart = document.getElementById("pieChart")

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

function displayPieGraph(values, chart) {
  var ctx = chart.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["Dairy", "Protein", "Fruit", "Vegetable", "Grain", "Other"],
        datasets: [{
            label: 'Food group consumption',
            data: values,
            backgroundColor: [
                'rgba(111, 57, 7, 0.61)',
                'rgba(249, 0, 0, 0.31)',
                'rgba(11, 79, 0, 0.56)',
                'rgba(82, 7, 7, 0.65)',
                'rgba(255, 246, 124, 0.61)',
                'rgba(143, 4, 218, 0.61)'
            ],
            borderColor: [
              'rgba(111, 57, 7, 0.61)',
              'rgba(249, 0, 0, 0.72)',
              'rgba(11, 79, 0, 0.83)',
              'rgba(98, 5, 5, 0.84)',
              'rgba(255, 246, 124, 0.81)',
              'rgba(166, 0, 255, 0.85)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        labels: {
          // This more specific font property overrides the global property
          fontSize: 30
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
}

function freq(val, arr) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      count++;
    }
  }
  return (count/arr.length);
}

function arrayify(json) {
  /*
  var arr = [];
  var food = JSON.parse(json);
  for (var i = 0; i < food.length; i++) {
    arr.push(food[i].foodGroup);
  }
  var temparr = ["Dairy", "Protein", "Fruit", "Vegetable", "Grain", "Other"];
  var temparr2 = []
  for (var i = 0; i < temparr.length; i++) {
    temparr2.push(freq(temparr[i], arr));
  }
  return temparr2; */
  var arr = [];
  var food = Object.values(json);
  for (var i = 0; i < food.length; i++) {
    arr.push(food[i]["foodGroup"]);
  }
  var temparr = ["Dairy", "Protein", "Fruit", "Vegetable", "Grain", "Other"];
  var temparr2 = []
  for (var i = 0; i < temparr.length; i++) {
    temparr2.push(freq(temparr[i], arr));
  }
  return temparr2;
}

function getFromServer() {
  /*
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/eatHistory", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState>3 && xhttp.status==200) {
      displayPieGraph(arrayify(xhttp.responseText), pieChart);;
    }
  };
  xhttp.send();*/
  var userId = firebase.auth().currentUser.uid;
  firebase.database().ref('/eatHistory/' + userId).once('value').then(function(snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    console.log(snapshot.val());
    displayPieGraph(arrayify(snapshot.val()), pieChart);
  });

}

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    showAuth();
    getFromServer();
  }
});
//displayPieGraph([1, 2, 3, 4, 5, 6], pieChart);
