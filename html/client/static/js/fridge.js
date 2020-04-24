/*var socket = io();
initializeFirebase();
showAuth();*/

function makeOperationButton(operation, qtyDis) {
  var button = document.createElement('a');
  button.style.width = "25px";
  button.style.height = "25px";
  button.style.backgroundColor = "rgb(156, 156, 156)";
  button.style.border = "1px solid black";
  button.style.borderRadius = "3px";
  button.style.color = "white";
  button.innerHTML = operation;
  button.style.textAlign = 'center';
  button.style.display = "inline-block";
  if (operation === '-') {
    button.style.marginRight = '5px';
  } else {
    button.style.marginLeft = '5px';
  }
  button.onclick = function() {
    document.getElementById('popup').style.display = "block";
    var opBut = document.getElementById('operationButton');
    opBut.innerHTML = operation;
    opBut.onclick = function() {
      if (operation === '-') {
        qtyDis.innerHTML = (parseInt(qtyDis.innerHTML.split(' ')[0]) - parseInt(document.getElementById('amountIn').value)).toString() + ' ' + qtyDis.innerHTML.split(' ')[1];
      } else {
        qtyDis.innerHTML = (parseInt(qtyDis.innerHTML.split(' ')[0]) + parseInt(document.getElementById('amountIn').value)).toString() + ' ' + qtyDis.innerHTML.split(' ')[1];
      }
      document.getElementById('popup').style.display = "none";
    }
  }
  return button;
}

function addFridgeItem(name, imageSRC, qty, unit) {
  var div = document.createElement('div');
  div.classList.add('center-div');
  div.style.border = "2px solid black";
  div.style.marginTop = '5px';
  div.style.marginLeft = '6px';

  var img = document.createElement('img');
  img.src = imageSRC;
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.display = "block";
  div.appendChild(img);

  var nameDis = document.createElement('p');
  nameDis.innerHTML = name;
  nameDis.style.display = 'block';
  nameDis.style.textAlign = 'center';
  nameDis.style.marginTop = '5px';
  nameDis.style.marginBottom = '5px';
  nameDis.style.color = "black";
  nameDis.style.height = '22px';
  nameDis.style.fontSize = Math.min(Math.ceil(180/name.length), 20).toString() + 'px';
  div.appendChild(nameDis);

  var qtyDis = document.createElement('p');
  qtyDis.innerHTML = qty.toString() + ' ' + unit;
  qtyDis.style.margin = '0px';
  qtyDis.style.marginLeft = '6px';
  qtyDis.style.display = "inline-block";

  var subtractButton = makeOperationButton('-', qtyDis);
  var addButton = makeOperationButton('+', qtyDis);

  div.appendChild(subtractButton);
  div.appendChild(qtyDis);
  div.appendChild(addButton);

  document.getElementById('supplyDrop').appendChild(div);
}

function addFood() {
  document.getElementById('addFoodPopup').style.display = "block";
  document.getElementById('enterFoodButton').onclick = function() {
    var foodIn = document.getElementById('foodNameIn');
    addFridgeItem(foodNameIn.value, 'https://assets.fireside.fm/file/fireside-images/podcasts/images/b/bc7f1faf-8aad-4135-bb12-83a8af679756/cover_small.jpg', 5, 'g');
    document.getElementById('addFoodPopup').style.display = "none";
  }
}

/*socket.emit('get stored foods');
socket.on('display stored foods', function(food) {

});
*/
// Demo: addFridgeItem('surya', 'https://assets.fireside.fm/file/fireside-images/podcasts/images/b/bc7f1faf-8aad-4135-bb12-83a8af679756/cover_small.jpg', 5, 'g');
