var socket = io();

function replaceStr(str, key, replaceWith) {
  str = str.replace(key, replaceWith);
  while (str.replace(key, replaceWith) !== str) {
    str = str.replace(key, replaceWith);
  }
  return str;
}

var foodNameh1 = document.getElementById("foodName");
foodNameh1.innerHTML = replaceStr(window.location.href.split('=')[1], '%20', ' ');
var idOfFood = parseInt(foodNameh1.innerHTML);

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
