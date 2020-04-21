var socket = io();

var nutritionDisplay = document.getElementById('rightBar');

var somethingWentWrong = false;
var parent = document.getElementById("stuff");

var filters = [document.getElementById("fruits"), document.getElementById("vegetables"),document.getElementById("grains"),document.getElementById("dairy"),document.getElementById("meat/beans")];

var itemIn = document.getElementById("itemIn");
var searchButton = document.getElementById("searchButton");

initializeFirebase();
showAuth();

function hideOrShowFilters() {
  if (filterTable.style.visibility === "collapse") {
    filterTable.style.visibility = "visible";
  }
  else {
    filterTable.style.visibility = "collapse";
  }
}

function eraseResults() {
  $('stuff').empty();
}

function processJSON(json) {
  var slider = document.getElementById('imgSize');

  try { json = JSON.parse(json); }
  catch (SyntaxError) { console.log('json is already an object'); }

  for (var food of json) (function(food) {
    var img = document.createElement('img');
    img.classList.add('image')
    img.src = food.image;

    img.onclick = function() {
      $('#rightBar').empty();
      var title = document.createElement('h2');
      title.innerHTML = food.title;
      nutritionDisplay.appendChild(title);

      var unnecessary = ['id', 'title', 'image', 'imageType'];

      for (var i = 0; i < Object.keys(food).length; i++) {
        if (!unnecessary.includes(Object.keys(food)[i])) {
          var p = document.createElement('p');
          p.innerHTML = Object.keys(food)[i] + ": " + Object.values(food)[i];
          nutritionDisplay.appendChild(p);
        }
      }
    }

    img.ondblclick = function() {
      socket.emit('displayFood', food);
    }

    parent.appendChild(img);
  })(food);

  slider.oninput = function() {
    var images = document.getElementsByClassName('image');
    for (var i = 0; i < images.length; i++) {
      images[i].style.width = this.value.toString();
      images[i].style.height = this.value.toString();
    }
  }
}

socket.on('recommendations', processJSON);

socket.on('redirect', function(location) {
  window.location.href = location;
});
