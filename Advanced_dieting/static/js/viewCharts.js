var lineChart = document.getElementById("lineChart")
var pieChart = document.getElementById("pieChart")

function displayLineGraph(values, chart) {
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

displayLineGraph([25, 25, 25, 10, 15], lineChart);
