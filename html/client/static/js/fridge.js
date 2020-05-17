var socket = io();
initializeFirebase();

var initialized = false;

var storedIngredientNames = [];

var clientUserId;

function makeOperationButton(operation, qtyDis, foodName) {
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
      var newValue = 0;
      if (operation === '-') {
        newValue = parseInt(qtyDis.innerHTML.split(' ')[0]) - parseInt(document.getElementById('amountIn').value);
        qtyDis.innerHTML = (newValue).toString() + ' ' + qtyDis.innerHTML.split(' ')[1];
      } else {
        newValue = parseInt(qtyDis.innerHTML.split(' ')[0]) + parseInt(document.getElementById('amountIn').value)
        qtyDis.innerHTML = (newValue).toString() + ' ' + qtyDis.innerHTML.split(' ')[1];
      }
      socket.emit('changeQty', foodName, newValue, clientUserId);
      document.getElementById('popup').style.display = "none";
    }
  }
  return button;
}

function addFridgeItem(name, imageSRC, qty, unit, possibleUnits) {
  //console.log(storedIngredientNames);
  if (storedIngredientNames.includes(name)) {
    console.log('already have ' + name);
    return;
  } else {
    storedIngredientNames.push(name);
  }

  var ingPopup = document.getElementById('specpopup');
  var ingPopupSelect = document.getElementById('specpopupSelect');
  var ingPopupSave = document.getElementById('specpopupSave');

  var div = document.createElement('div');
  div.classList.add('center-div');
  div.style.border = "2px solid black";
  div.style.marginTop = '5px';
  div.style.marginLeft = '6px';
  div.style.background = 'linear-gradient(rgba(110, 107, 107, 0.6), rgba(182, 203, 189, 1))';

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

  img.onclick = function() {
    ingPopup.style.display = 'block';
    $('#specpopupSelect').empty();
    for (var i = 0; i < possibleUnits.length; i++) {
      var newOption = document.createElement('option');
      newOption.value = possibleUnits[i];
      newOption.innerHTML = possibleUnits[i];
      ingPopupSelect.appendChild(newOption);
    }
    ingPopupSave.onclick = function() {
      ingPopup.style.display = 'none';
      qtyDis.innerHTML = qtyDis.innerHTML.replace(/\D/g,'') + ingPopupSelect.value;
    }
  }

  var subtractButton = makeOperationButton('-', qtyDis, name);
  var addButton = makeOperationButton('+', qtyDis, name);

  div.appendChild(subtractButton);
  div.appendChild(qtyDis);
  div.appendChild(addButton);

  document.getElementById('supplyDrop').appendChild(div);
}

function addFood() {
  $('#ingredientsResponse').empty();
  document.getElementById('addFoodPopup').style.display = "block";
  document.getElementById('enterFoodButton').onclick = function() {
    $('#ingredientsResponse').empty();
    var foodIn = document.getElementById('foodNameIn');
    if (foodIn.value.substring(0,1) === '/') {
      var foodInProcessed = foodIn.value.substring(1).split(',');
      socket.emit('find ingredients arr', foodInProcessed);
      socket.on('ingredientsArrRes', function(res) {
        console.log(res);
        for (var i = 0; i < res.length; i++) (function(i) {
          var ing = res[i];
          console.log('adding ' + ing.name + ' to fridge');
          var imageLink ='https://spoonacular.com/cdn/ingredients_100x100/' + ing.image;
          socket.emit('save ingredient', firebase.auth().currentUser.uid, {id: ing.id, name: ing.name, image: imageLink, qty: 5, unit: 'g'});
          addFridgeItem(ing.name, imageLink, 5, 'g', ing.possibleUnits);
          document.getElementById('addFoodPopup').style.display = "none";
        })(i)
      })
    } else {
      socket.emit('find ingredients', foodIn.value);
      socket.on('ingredientsRes', function(res) {
        console.log(res);
        for (var ing of res) (function(ing) {
          var ingDiv = document.createElement('div');
          ingDiv.style.display = 'inline-block';
          ingDiv.style.margin = '8px';

          var ingIMG = document.createElement('img');
          ingIMG.src = 'https://spoonacular.com/cdn/ingredients_100x100/' + ing.image;
          ingIMG.style.display = 'inline-block';
          ingIMG.style.marginRight = '8px';
          ingDiv.appendChild(ingIMG);

          var textAndButtonDiv = document.createElement('div');
          textAndButtonDiv.style.display = 'inline-block';

          var ingText = document.createElement('p');
          ingText.style.display = 'block';
          ingText.style.marginBottom = '6px';
          ingText.innerHTML= ing.name;

          var addToFridgeButton = document.createElement('button');
          addToFridgeButton.style.display = 'block';
          addToFridgeButton.innerHTML = 'Add To Fridge';
          addToFridgeButton.onclick = function() {
            console.log('adding ' + ing.name + ' to fridge');
            var imageLink ='https://spoonacular.com/cdn/ingredients_100x100/' + ing.image;
            socket.emit('save ingredient', firebase.auth().currentUser.uid, {id: ing.id, name: ing.name, image: imageLink, qty: 5, unit: 'g'});
            addFridgeItem(ing.name, imageLink, 5, 'g');
            document.getElementById('addFoodPopup').style.display = "none";
          }

          textAndButtonDiv.appendChild(ingText);
          textAndButtonDiv.appendChild(addToFridgeButton);
          ingDiv.appendChild(textAndButtonDiv);
          document.getElementById('ingredientsResponse').appendChild(ingDiv);
        })(ing)
      })
    }
  }
}

firebase.auth().onAuthStateChanged(user => {
  if (!initialized) {
    initialized = true;
    console.log(initialized);
    showAuth();
    clientUserId = user.uid;
    socket.emit('get stored foods', user.uid);
    socket.on('display stored foods', function(food) {
      console.log(food);
      for (var i = 0; i < Object.keys(food).length; i++) {
        var foodIng = food[Object.keys(food)[i]];
        addFridgeItem(foodIng.name, foodIng.image, foodIng.qty, foodIng.unit, foodIng.possibleUnits);
      }
    });
  }
})
