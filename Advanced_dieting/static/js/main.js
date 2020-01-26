var parent = document.getElementById("stuff");
var foodDict = {};
var eatHistory = [];

var itemIn = document.getElementById("itemIn");
var searchButton = document.getElementById("searchButton");
searchButton.onclick = function() {
  searchFor(itemIn.value);
}

async function getInfo(rawItem, debugMode) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://trackapi.nutritionix.com/v2/natural/nutrients", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-app-id", "0f5b2979");
  xhttp.setRequestHeader("x-app-key", "4f56f9a75a02379481cd2cfc7e025527");
  xhttp.setRequestHeader("x-remote-user-id", "0");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState>3 && xhttp.status==200) { searched(xhttp.responseText); }
  };
  xhttp.send('{"query":"'+rawItem+'","timezone": "US/Western"}');
}

function sendToServer(item) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/eatHistory", true);
  xhttp.send(JSON.stringify(item));
}

function searchFor(food) {
  var json = getInfo(food, true);
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
  foodDict[food["food_name"]] = tempFood;
}
function createButton(item_name, item) {
  var button = document.createElement('button');
  var link = document.createTextNode(item_name + " details");
  button.appendChild(link);

  var image = document.createElement("IMG");
  image.src = foodDict[item_name].img;
  parent.appendChild( image , button.nextSibling );

  var eatButton = document.createElement('button');
  var eatText = document.createTextNode("eat " + item_name);
  eatButton.appendChild(eatText);

  eatButton.onclick = function() {
    eatHistory.push(foodDict[item_name]);
    sendToServer(foodDict[item_name]);
  }
  parent.appendChild( eatButton , button.nextSibling );

  button.onclick = function() {
    var fid = foodDict[item_name];

    var namesOfVars = ["calories", "cholesterol", "dietary fibers", "potassium", "protein", "saturated fat", "sodium", "sugar", "carb", "total fat"];
    var thingsToAdd = [fid.cal, fid.cholesterol, fid.dietaryfiber, fid.potassium, fid.protein, fid.satFat, fid.sodium, fid.sugar, fid.carb, fid.fat, fid.servingQty];

    for (var i = 0; i < namesOfVars.length; i++) {
      var h4 = document.createElement("h4");
      h4.innerHTML = (namesOfVars[i] + ": " + thingsToAdd[i].toString() + "g");
      button.parentNode.insertBefore(h4, button.nextSibling);
    }
  }
  return button;
}
function eraseResults() {
  while (parent.firstNode) {
    parent.removeChild(parent.firstNode);
  }
}

function searched(json) {
  if (json != undefined) {
    eraseResults();
    console.log(json);
    json = JSON.parse(json);
    console.log(json);
    for (var i = 0; i < json["foods"].length; i++) {
      var item_name = json["foods"][i]["food_name"];
      addToDictionary(json["foods"][i]);
      parent.appendChild(createButton(item_name));
    }
    console.log(foodDict);
  }
}
