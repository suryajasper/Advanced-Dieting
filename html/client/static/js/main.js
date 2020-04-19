var socket = io();

var nutritionDisplay = document.getElementById('rightBar');

var somethingWentWrong = false;
var parent = document.getElementById("stuff");
var foodDict = {};
var eatHistory = [];

var filters = [document.getElementById("fruits"), document.getElementById("vegetables"),document.getElementById("grains"),document.getElementById("dairy"),document.getElementById("meat/beans")];

var itemIn = document.getElementById("itemIn");
var searchButton = document.getElementById("searchButton");

initializeFirebase();

var database = firebase.database();
var rootUser = database.ref("users");

showAuth();

function hideOrShowFilters() {
  if (filterTable.style.visibility === "collapse") {
    filterTable.style.visibility = "visible";
  }
  else {
    filterTable.style.visibility = "collapse";
  }
}

function sendToServer(item) {
  /*
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/eatHistory", true);
  xhttp.send(JSON.stringify(item));
  */

  item.setDate(getDate());

  var userId = firebase.auth().currentUser.uid;

  var postData = item;

  var updates = {};

  console.log('sending ' + item.name);

  updates['/eatHistory/' + userId + '/' + item.name] = postData;

  firebase.database().ref().update(updates);
}

/*
function getFromServer() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/userPreferences", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState>3 && xhttp.status==200) {
      var json = JSON.parse(xhttp.responseText);
      var toLose = json[1];
      var toGain = json[2];
    }
  };
}*/

function getDate() {
  var today = new Date();
  var _year = parseInt(today.getFullYear());
  var _month = parseInt(today.getMonth()+1);
  var _day = parseInt(today.getDate());
  var _hour = parseInt(today.getHours());
  var _minute = parseInt(today.getMinutes());
  var _second = parseInt(today.getSeconds());
  return {
    year: _year,
    month: _month,
    day: _day,
    hour: _hour,
    minute: _minute,
    second: _second
  };
}
function addToDictionary(food) {
  tempFood = new Food(food["food_name"]);
  tempFood.setCalories(food["nf_calories"]);
  tempFood.setCholesterol(food["nf_cholesterol"]);
  tempFood.setDietaryFiber(food["nf_dietary_fiber"]);
  tempFood.setPotassium(food["nf_potassium"]);
  tempFood.setProtein(food["nf_protein"]);
  tempFood.setSatFat(food["nf_saturated_fat"]);
  tempFood.setSodium(food["nf_sodium"]);
  tempFood.setSugar(food["nf_sugars"]);
  tempFood.setCarb(food["nf_total_carbohydrate"]);
  tempFood.setFat(food["nf_total_fat"]);
  tempFood.setImage(food["photo"]["highres"]);
  tempFood.setServingQuantity(food["serving_qty"]);
  var intfoodgroup = food["tags"]["food_group"];
  var realfoodgroup = null;
  var temparr = ["Dairy", "Protein", "Fruit", "Vegetable", "Grain"];
  if (intfoodgroup > 5)
    realfoodgroup = "Other";
  else {
    realfoodgroup = temparr[intfoodgroup-1];
  }
  tempFood.setFoodGroup(realfoodgroup);
  //console.log(tempFood.foodGroup);
  foodDict[food["food_name"]] = tempFood;
}
function createButton(item_name, item) {
  var cell = document.createElement('div');
  cell.classList.add( "col-xs-6" );
  cell.classList.add( "col-sm-4" );
  cell.classList.add( "col-lg-3" );
  cell.classList.add( "cellFormat" );

  var well = document.createElement('div');
  well.classList.add('well');

  var button = document.createElement('button');
  var link = document.createTextNode(item_name + " details");
  button.appendChild(link);

  var image = document.createElement("IMG");
  image.src = foodDict[item_name].img;
  image.onclick = function() {
    window.location = '../templates/foodDetails.html?foodName='+item_name;
  };
  well.appendChild( image );

  var br = document.createElement('br');
  well.appendChild(br);

  var eatButton = document.createElement('button');
  var eatText = document.createTextNode("eat " + item_name);
  eatButton.appendChild(eatText);
  eatButton.style.display = "inline-block";

  eatButton.onclick = function() {
    eatHistory.push(foodDict[item_name]);
    //console.log(foodDict[item_name].foodGroup);
    sendToServer(foodDict[item_name]);
  }
  well.appendChild( eatButton );

  button.onclick = function() {
    var fid = foodDict[item_name];

    var namesOfVars = ["calories", "cholesterol", "dietary fibers", "potassium", "protein", "saturated fat", "sodium", "sugar", "carb", "total fat"];
    var thingsToAdd = [fid.cal, fid.cholesterol, fid.dietaryfiber, fid.potassium, fid.protein, fid.satFat, fid.sodium, fid.sugar, fid.carb, fid.fat, fid.servingQty];

    for (var i = 0; i < namesOfVars.length; i++) {
      var h4 = document.createElement("h4");
      let measurement = namesOfVars[i] === "calories"? "cal" : (namesOfVars[i]==="potassium" || namesOfVars[i]==="sodium")?"mg":"g";
      h4.innerHTML = (namesOfVars[i] + ": " + thingsToAdd[i].toString() + measurement);
      button.parentNode.insertBefore(h4, button.nextSibling);
    }
  }

  button.style.display = "inline-block";
  well.appendChild(button);

  cell.appendChild(well);

  return cell;
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
      socket.emit('displayFood', food.id);
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
