var socket = io();

var lineChart = document.getElementById("lineChart")
var pieChart = document.getElementById("pieChart")

initializeFirebase();

var nutrients = ['alcohol','caffeine','calcium','calories','carbs','cholesterol','copper','fat','fiber','folate','iron','magnesium','manganese','phosphorus','potassium','protein','saturatedFat','selenium','sodium','sugar','vitaminA','vitaminB1','vitaminB12','vitaminB2','vitaminB3','vitaminB5','vitaminB6','vitaminC','vitaminD','vitaminE','vitaminK','zinc'];

function addOptions(select_id, options) {
  $('#' + select_id).empty();
  for (var optionText of options) {
    var newOption = document.createElement('option');
    newOption.innerHTML = optionText;
    newOption.value = optionText;
    document.getElementById(select_id).appendChild(newOption);
  }
}

addOptions('data', nutrients);

function displayLineGraph(title, values, chart) {
  var ctx = chart.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(values),
      datasets: [{
        label: title,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHitRadius: 10,
        data: Object.values(values),
      }]
    },
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
  });
}

function getFromServer(id) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    console.log(snapshot.val());
    displayPieGraph(arrayify(snapshot.val()), pieChart);
}

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    showAuth();
    document.getElementById('genGraph').onclick = function(e) {
      e.preventDefault();
      displayLineGraph('testChart', {"hi": 1, "hi1": 2,"hi2":  3,"hi3":  4}, document.getElementById('lineChart'));
      //getFromServer(user.uid);
    }
  }
});
