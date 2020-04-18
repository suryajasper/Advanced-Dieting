var express = require('express');
var app = express();
app.use(express.static(__dirname + '/client'));
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

function getFoodParam() {
  var unirest = require("unirest");

  var req = unirest("GET", "https://api.spoonacular.com/recipes/findByNutrients");

  req.query({
    "apiKey": "bc240f5675d94b39b9a096f5a949a9d7",
  	"minCarbs": "0",
  	"minProtein": "0",
  	"offset": "0",
  	"number": "5",
  	"maxCalories": "250",
  	"maxCarbs": "100",
  	"maxFat": "20",
  	"maxProtein": "100",
  	"minFat": "5",
  	"minCalories": "0",
  	"minAlcohol": "0",
  	"maxAlcohol": "50",
  	"minCaffeine": "0",
  	"maxCaffeine": "50",
  	"minCopper": "0",
  	"maxCopper": "50",
  	"minCalcium": "0",
  	"maxCalcium": "50",
  	"minCholine": "0",
  	"maxCholine": "50",
  	"minCholesterol": "0",
  	"maxCholesterol": "50",
  	"minFluoride": "0",
  	"maxFluoride": "50",
  	"minSaturatedFat": "0",
  	"maxSaturatedFat": "50",
  	"minVitaminA": "0",
  	"maxVitaminA": "50",
  	"minVitaminC": "0",
  	"maxVitaminC": "50",
  	"minVitaminD": "0",
  	"maxVitaminD": "50",
  	"minVitaminE": "0",
  	"maxVitaminE": "50",
  	"minVitaminK": "0",
  	"maxVitaminK": "50",
  	"minVitaminB1": "0",
  	"maxVitaminB1": "50",
  	"minVitaminB2": "0",
  	"maxVitaminB2": "50",
  	"minVitaminB5": "0",
  	"maxVitaminB5": "50",
  	"minVitaminB3": "0",
  	"maxVitaminB3": "50",
  	"minVitaminB6": "0",
  	"maxVitaminB6": "50",
  	"minVitaminB12": "0",
  	"maxVitaminB12": "50",
  	"minFiber": "0",
  	"maxFiber": "50",
  	"minFolate": "0",
  	"maxFolate": "50",
  	"minFolicAcid": "0",
  	"maxFolicAcid": "50",
  	"minIodine": "0",
  	"maxIodine": "50",
  	"minIron": "0",
  	"maxIron": "50",
  	"maxMagnesium": "50",
  	"minManganese": "0",
  	"maxManganese": "50",
  	"minPhosphorus": "0",
  	"maxPhosphorus": "50",
  	"minPotassium": "0",
  	"maxPotassium": "50",
  	"minSelenium": "0",
  	"maxSelenium": "50",
  	"minSodium": "0",
  	"maxSodium": "50",
  	"minSugar": "0",
  	"maxSugar": "50",
  	"minZinc": "0",
  	"maxZinc": "50",
  	"limitLicense": "false"
  });

  return req;
}

io.on('connection', function(socket){
  var promise = getFoodParam();
  promise.end(function (res) {
  	if (res.error) {
      console.log(res.error);
    }
  	socket.emit('recommendations', res.body);
  });

})

http.listen(port, function(){
  console.log('listening on port' + port.toString());
});
