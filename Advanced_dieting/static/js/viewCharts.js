var lineChart = document.getElementById("lineChart")
var pieChart = document.getElementById("pieChart")

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
  var food = JSON.parse(json);
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
//displayPieGraph([1, 2, 3, 4, 5, 6], pieChart);
