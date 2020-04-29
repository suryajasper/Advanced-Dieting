var socket = io();
initializeFirebase();

var initialized = false;

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
          var ing = res[i][0];
          console.log('adding ' + ing.name + ' to fridge');
          var imageLink ='https://spoonacular.com/cdn/ingredients_100x100/' + ing.image;
          socket.emit('save ingredient', firebase.auth().currentUser.uid, {id: ing.id, name: ing.name, image: imageLink, qty: 5, unit: 'g'});
          addFridgeItem(ing.name, imageLink, 5, 'g');
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
    socket.emit('get stored foods', user.uid);
    socket.on('display stored foods', function(food) {
      console.log(food);
      for (var i = 0; i < Object.keys(food).length; i++) {
        var foodIng = food[Object.keys(food)[i]];
        addFridgeItem(foodIng.name, foodIng.image, foodIng.qty, foodIng.unit);
      }
    });
  }
})

// Demo: addFridgeItem('surya', 'https://assets.fireside.fm/file/fireside-images/podcasts/images/b/bc7f1faf-8aad-4135-bb12-83a8af679756/cover_small.jpg', 5, 'g');
