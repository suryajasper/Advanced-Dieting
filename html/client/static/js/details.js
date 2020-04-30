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

var foodNameh1 = document.getElementById("foodName");
var locationVars = replaceStr(window.location.href.split('?')[1], '%20', ' ');
foodNameh1.innerHTML =  locationVars.split('&')[1].split('=')[1];
var idOfFood = parseInt(locationVars.split('&')[0].split('=')[1]);

firebase.auth().onAuthStateChanged(user => {
  showAuth();
  var eatButton = document.createElement('button');
  eatButton.innerHTML = "Eat";
  eatButton.style.display = 'inline-block';
  eatButton.onclick = function() {
    var originalColor = this.style.backgroundColor;
    socket.emit('addToEatHistory', user.uid, idOfFood, getDate());
    this.innerHTML = 'Added to Eat History';
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
