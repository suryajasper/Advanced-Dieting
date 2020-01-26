function getInfo(rawItem) {
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
  		return this.responseText;
  	}
  });

  xhr.open("GET", "https://nutritionix-api.p.rapidapi.com/v1_1/search/" + item + "?fields=item_name%252Citem_id%252Cbrand_name%252Cnf_calories%252Cnf_total_fat");
  xhr.setRequestHeader("x-rapidapi-host", "nutritionix-api.p.rapidapi.com");
  xhr.setRequestHeader("x-rapidapi-key", "cd5b695f86mshea1c3efaf3a5f98p1ea3b2jsnb129655a7665");

  xhr.send(data);
}
