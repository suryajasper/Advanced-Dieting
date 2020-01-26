var parent = document.getElementById("stuff");

async function getInfo(rawItem, debugMode) {
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
}

function searchFor(foodGroup) {
  var json = getInfo(foodGroup, true);
}

var search;
function loadImage(keyword, output) {
  search = new google.search.ImageSearch();
  search.setSearchCompleteCallback(this, function() {searchComplete(output)}, null);
  search.execute(keyword);
}
function searchComplete(output) {
  if (search.results && search.results.length > 0) {
    output.src = "url('" + search.results[0]['url'] + "')";
  }
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
    json = JSON.parse(json);
    console.log(json);
    for (var i = 0; i < json["hits"].length; i++) {
      var item_name = json["hits"][i]["fields"]["item_name"];
      parent.appendChild(createButton(item_name));
    }
  }
}
