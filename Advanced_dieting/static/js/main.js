var parent = document.getElementById("stuff");
var foodDict = {};

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
  xhttp.send('{"query":"'+rawItem+'","timezone": "US/Eastern"}');
}

function searchFor(foodGroup) {
  var json = getInfo(foodGroup, true);
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
  var link = document.createTextNode(item_name);
  button.appendChild(link);
  button.onclick = function() {
    console.log("HEY");
    var image = document.createElement("IMG");
    image.src = foodDict[item_name].img;
    document.body.appendChild(image);
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
