var parent = document.getElementById("stuff");
var foodDict = {};
var eatHistory = [];
var vegetables = "amaranth leaves/arrowroot/artichoke/arugula/asparagus/bamboo shoots/green beans/beets/belgian endive/bitter melon/bok choy/broadbeans/broccoli/broccoli rabe/brussel sprouts/green cabbage/red cabbage/carrot/cassava/cauliflower/celeriac/celery/chayote/chicory/collards/corn/crookneck/cucumber/daikon/dandelion greens/eggplant/fennel/fiddleheads/ginger root/horseradish/jicama/kale/kohlrabi/leeks/iceberg lettuce/leaf lettuce/mushrooms/mustard greens/okra/onion/parsnip/peas/pepper/potato/pumpkin/radicchio/radishes/rutabaga/salsify/shallots/snow peas/sorrel/spaghetti squash/spinach/squash/sugar snap peas/sweat potato/swiss chard/tomatillo/tomato/turnip/watercress/yam root/zucchini";
var fruits = "acerola/apple/apricot/avocado/banana/blackberry/blackcurrant/blueberry/breadfruit/cantaloupe/carambola/cherimoya/cherry/clementine/coconut/cranberry/custard-apple/date/durian/elderberry/feijoa/figs/gooseberry/grapefruit/grape/guava/honeydew melon/jackfruit/java plum/jujube fruit/kiwi/kumquat/lemon/longan/loquat/lychee/mandarin/mango/mangosteen/mulberry/nectarine/olive/orange/papaya/passion fruit/peaches/pear/persimmon/pitaya/pineapple/pitanga/plantain/plum/pomegranate/prickly pear/prune/pummelo/quince/raspberry/rhubarb/rose apple/sapodilla/sapote/soursop/strawberry/sugar apple/tamarind/tangerine/watermelon";

var itemIn = document.getElementById("itemIn");
var searchButton = document.getElementById("searchButton");

searchButton.onclick = function() {
  searchFor(itemIn.value);
}

async function getInfo(rawItem, debugMode) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://trackapi.nutritionix.com/v2/natural/nutrients", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-app-id", "48455876");
  xhttp.setRequestHeader("x-app-key", "060a6724c37307eaf9836fbd94ea6195");
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
  if (food === "fruits") {
    var json = getInfo(fruits, true);
  }
  if (food === "vegetables") {
    var json = getInfo(vegetables, true);
  }
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
      var br = document.createElement('br');
      parent.appendChild( br );
    }
    console.log(foodDict);
  }
}
