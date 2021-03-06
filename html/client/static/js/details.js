var socket = io();
initializeFirebase();

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function replaceStr(str, key, replaceWith) {
  str = str.replace(key, replaceWith);
  while (str.replace(key, replaceWith) !== str) {
    str = str.replace(key, replaceWith);
  }
  return str;
}

async function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout*1000);
  });
}

function startWithZero(number) {
  if (number.toString().length > 2) {
    return number.toString();
  } else {
    return ('0' + number).slice(-2);
  }
}

function fillWithOptions(select, options, optionValues) {
  $('#' + select.id).empty();
  var toLoopStart = (Number.isInteger(options)) ? options : 0;
  var toLoopEnd = (optionValues === null) ? options.length: (Number.isInteger(optionValues) ? optionValues : optionValues.length);
  for (var i = toLoopStart; i < toLoopEnd; i++) {
    var newOption = document.createElement('option');
    if (optionValues === null || Number.isInteger(optionValues)) {
      newOption.value = startWithZero(i+1);
    } else {
      newOption.value = optionValues[i];
    }
    if (options === null || Number.isInteger(optionValues)) {
      newOption.innerHTML = i+1;
    } else {
      newOption.innerHTML = options[i];
    }
    select.appendChild(newOption);
  }
}

function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}

var foodNameh1 = document.getElementById("foodName");
var locationVars = replaceStr(window.location.href.split('?')[1], '%20', ' ');
var nameOfFood = locationVars.split('&')[1].split('=')[1];
foodNameh1.innerHTML =nameOfFood;
var idOfFood = parseInt(locationVars.split('&')[0].split('=')[1]);

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthSelect = document.getElementById('monthSelect');
var daySelect = document.getElementById('daySelect');
var yearSelect = document.getElementById('yearSelect');

function modifyDaySelect() {
  fillWithOptions(daySelect, 0, daysInMonth(parseInt(monthSelect.value), parseInt(yearSelect.value)));
}
function formatAsDate() {
  return monthSelect.value + '/' + daySelect.value + '/' + yearSelect.value;
}

fillWithOptions(monthSelect, months, null, null);
fillWithOptions(daySelect, 0, 31, null);
fillWithOptions(yearSelect, 2000, 2020, false);

monthSelect.value = startWithZero(new Date().getMonth() + 1);
yearSelect.value = startWithZero(new Date().getFullYear());

modifyDaySelect();
daySelect.value = startWithZero(new Date().getDate());

monthSelect.oninput = modifyDaySelect;
yearSelect.oninput = modifyDaySelect;

firebase.auth().onAuthStateChanged(user => {
  showAuth();
  socket.emit('redirectToDetailsSuccessful', idOfFood);
  var eatButton = document.getElementById('eatButton');
  eatButton.disabled = true;
  eatButton.style.display = 'inline-block';
  socket.on('eatReady', function() {
    document.getElementById('eatButton').disabled = false;
  })
  eatButton.onclick = function() {
    var originalColor = this.style.backgroundColor;
    socket.emit('addToEatHistory', user.uid, idOfFood, nameOfFood, formatAsDate());
    this.innerHTML = 'Added';
    this.style.backgroundColor = "rgb(42, 147, 55)";
    var changeTextPromise = wait(0.5);
    changeTextPromise.then(function() {
      eatButton.innerHTML = 'Eat';
      eatButton.style.backgroundColor = originalColor;
    });
  }
  document.body.appendChild(eatButton);
});

socket.emit('visualizeNutrients', idOfFood);
socket.emit('visualizeIngredients', idOfFood);

socket.on('ingredients', function(htmlRaw) {
  var html = htmlRaw.toString();
  var newDiv = document.createElement('div');
  var h2 = document.createElement('h2');
  h2.innerHTML = "Ingredients";
  newDiv.appendChild(h2);
  newDiv.innerHTML += html;
  newDiv.removeChild( newDiv.children[2]);
  newDiv.removeChild( newDiv.children[newDiv.children.length-1]);
  document.body.appendChild(newDiv);
});

socket.on('nutrients', function(htmlRaw) {
  var html = htmlRaw.toString();
  var newDiv = document.createElement('div');
  var h2 = document.createElement('h2');
  h2.innerHTML = "Nutrients";
  newDiv.appendChild(h2);
  newDiv.innerHTML += html;
  newDiv.removeChild( newDiv.children[newDiv.children.length-1]);
  document.body.appendChild(newDiv);
});
