var parent = document.getElementById("stuff");

async function getInfo(rawItem, debugMode) {
  /*
  var splitArr = rawItem.split(' ');
  var item = rawItem;
  if (splitArr.length > 1) {
    item = "";
    for (var i = 0; i < splitArr.length - 1; i++) {
      item += splitArr[i] + "%2520";
    }
  }

  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
  	if (this.readyState === this.DONE) {
  		searched(this.responseText);
  	}
  });
  var str = debugMode ? "?fields=item_name" : "?fields=item_name%252Citem_id%252Cbrand_name%252Cnf_calories%252Cnf_total_fat";
  xhr.open("GET", "https://nutritionix-api.p.rapidapi.com/v1_1/search/" + item + str);
  xhr.setRequestHeader("x-rapidapi-host", "nutritionix-api.p.rapidapi.com");
  xhr.setRequestHeader("x-rapidapi-key", "cd5b695f86mshea1c3efaf3a5f98p1ea3b2jsnb129655a7665");

  xhr.send(data);
  */

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

function createButton(item_name) {
  var a = document.createElement('a');
  var link = document.createTextNode(item_name);
  a.appendChild(link);
  a.title = item_name;
  a.href = "/#";
  return a;
}
function eraseResults() {
  for (var i = 0; i < parent.children.length; i++) {
    parent.removeChild(parent.childNodes[0]);
  }
}

function searched(json) {
  if (json != undefined) {
    eraseResults();
    console.log(json);
    json = JSON.parse(json);
    console.log(json);
    for (var i = 0; i < json["foods"].length; i++) {
      var item_name = json["foods"][i]["fields"]["item_name"];
      parent.appendChild(createButton(item_name));
    }
  }
}
