var lineChart = document.getElementById("lineChart")
var pieChart = document.getElementById("pieChart")

function displayPieGraph(values, chart) {
  var ctx = chart.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Grain', 'Fruit', 'Vegetable', 'Meat/Beans', 'Milk/Dairy'],
        datasets: [{
            label: 'Food group consumption',
            data: values,
            backgroundColor: [
                'rgba(111, 57, 7, 0.61)',
                'rgba(249, 0, 0, 0.31)',
                'rgba(11, 79, 0, 0.56)',
                'rgba(82, 7, 7, 0.65)',
                'rgba(255, 246, 124, 0.61)'
            ],
            borderColor: [
              'rgba(111, 57, 7, 0.61)',
              'rgba(249, 0, 0, 0.72)',
              'rgba(11, 79, 0, 0.83)',
              'rgba(98, 5, 5, 0.84)',
              'rgba(255, 246, 124, 0.81)'
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

function arrayify(json) {
  var arr = [];
  for (var i = 0; i < json.length; i++) {
    var food = JSON.parse(json);
    arr.push(food.cal);
  }
  return arr;
}

function getFromServer() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/eatHistory", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState>3 && xhttp.status==200) {
      displayPieGraph(arrayify(xhttp.responseText), pieChart);;
    }
  };
  xhttp.send();
}

getFromServer();
