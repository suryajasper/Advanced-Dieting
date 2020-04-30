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

function formatAsCoordinates(values) {
  coordinateSystem = [];
  for (var key of Object.keys(values)) {
    coordinateSystem.push({x: key, y: values[key]});
  }
  return coordinateSystem;
}

addOptions('data', nutrients);

function displayLineGraph(title, values, chart) {
  var ctx = chart.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: title,
        showLine: true,
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
        data: values
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

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    showAuth();
    document.getElementById('genGraph').onclick = function(e) {
      e.preventDefault();
      socket.emit('sort by date', user.uid, document.getElementById('data').value);
      socket.on('sorted by date', function( monthTotal, yearTotal ) {
        var month = document.getElementById('month').value;
        var year = document.getElementById('year').value;
        var toDisplay = (month === 0) ? yearTotal : monthTotal[month];
        displayLineGraph('testChart', formatAsCoordinates(toDisplay), document.getElementById('lineChart'));
      })
      //getFromServer(user.uid);
    }
  }
});
