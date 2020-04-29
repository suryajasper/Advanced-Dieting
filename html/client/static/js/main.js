var socket = io();

var nutritionDisplay = document.getElementById('rightBar');

var somethingWentWrong = false;
var parent = document.getElementById("stuff");

var itemIn = document.getElementById("itemIn");
var searchButton = document.getElementById("searchButton");
var filters = document.getElementById('filters');

var filtArr = {"meal": ['main course','side dish','dessert','appetizer','salad','bread','breakfast','soup','beverage','sauce','marinade','fingerfood','snack','drink'],
             "cuisine": ['African','American','British','Cajun','Caribbean','Chinese','Eastern European','European','French','German','Greek','Indian','Irish','Italian','Japanese','Jewish','Korean','Latin American','Mediterranean','Mexican','Middle Eastern','Nordic','Southern','Spanish','Thai','Vietnamese'],
             "intolerance": ['Dairy','Egg','Gluten','Grain','Peanut','Seafood','Sesame','Shellfish','Soy','Sulfite','Tree Nut','Wheat'],
             "diet": ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30']};

function addOptions(select_id, options) {
  var defaultOption = document.createElement('option');
  defaultOption.innerHTML = 'all';
  defaultOption.value = 'all';
  document.getElementById(select_id).appendChild(defaultOption);
  for (var optionText of options) {
    var newOption = document.createElement('option');
    newOption.innerHTML = optionText;
    newOption.value = optionText;
    document.getElementById(select_id).appendChild(newOption);
  }
}

for (var currFilter of Object.keys(filtArr)) {
  addOptions(currFilter, filtArr[currFilter]);
}

initializeFirebase();
showAuth();

function eraseResults() {
  $('#stuff').empty();
}

function processJSON(json) {
  eraseResults();
  var slider = document.getElementById('imgSize');

  try { json = JSON.parse(json); }
  catch (SyntaxError) { console.log('json is already an object'); }

  for (var food of json) (function(food) {
    var img = document.createElement('img');
    img.classList.add('image')
    img.src = food.image;

    /*img.onclick = function() {
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
    }*/

    img.onclick = function() {
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

socket.on('getByIngredientsRes', processJSON);

socket.on('redirect', function(location) {
  window.location.href = location;
});

firebase.auth().onAuthStateChanged(function(user) {
  document.getElementById('whatcanimake').onclick = function(e) {
    e.preventDefault();
    socket.emit('get stored foods', user.uid);
    socket.on('display stored foods', function(foods) {
      socket.emit('get by ingredients', Object.keys(foods));
    })
  }
})

document.getElementById('searchButton').onclick = function(e) {
  e.preventDefault();
  var filterDict = {};
  for (var currFilter of Object.keys(filtArr)) {
    var filtVal = document.getElementById(currFilter).value;
    if (filtVal !== 'all') {
      filterDict[currFilter] = filtVal;
    }
  }
  console.log(filterDict);
  socket.emit('search', itemIn.value, filterDict);
}

socket.on('searchRes', function(res) {
  console.log(res);
  processJSON(res);
})
