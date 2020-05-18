var admin = require("firebase-admin");

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/client'));
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

var serviceAccount = require("/Users/suryajasper2004/Downloads/service-account-file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://advanced-dieting.firebaseio.com"
});

var database = admin.database();

var refUsers = database.ref("users");
var refEatHistory = database.ref("eatHistory");
var refAllFood = database.ref("allFoodData");
var refIngredients = database.ref('ingredients');

function replaceAll(string, part, newPart) {
  string = string.replace(part, newPart);
  while (string.indexOf(part) !== -1) {
    string = string.replace(part, newPart);
  }
  return string;
}

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

function getNutritionById(id) {
  var unirest = require("unirest");

  var req = unirest("GET", "https://api.spoonacular.com/recipes/" + id.toString() + "/nutritionWidget.json");

  req.query({"apiKey": "bc240f5675d94b39b9a096f5a949a9d7"});

  return req;
}

function searchFood(name, query) {
  var unirest = require("unirest");
  var req = unirest("GET", "https://api.spoonacular.com/recipes/searchComplex");
  var toQuery = {
    "apiKey": "bc240f5675d94b39b9a096f5a949a9d7",
  	"query": name,
  	"minCalories": "150",
  	"maxCalories": "1500",
  	"minFat": "5",
  	"maxFat": "100",
  	"minProtein": "5",
  	"maxProtein": "100",
  	"minCarbs": "5",
  	"maxCarbs": "100",
  	"minAlcohol": "0",
  	"maxAlcohol": "1000",
  	"minCaffeine": "0",
  	"maxCaffeine": "1000",
  	"minCopper": "0",
  	"maxCopper": "1000",
  	"minCalcium": "0",
  	"maxCalcium": "1000",
  	"minCholine": "0",
  	"maxCholine": "1000",
  	"minCholesterol": "0",
  	"maxCholesterol": "1000",
  	"minFluoride": "0",
  	"maxFluoride": "1000",
  	"minSaturatedFat": "0",
  	"maxSaturatedFat": "50",
  	"minVitaminA": "0",
  	"maxVitaminA": "5000",
  	"minVitaminC": "0",
  	"maxVitaminC": "1000",
  	"minVitaminD": "0",
  	"maxVitaminD": "1000",
  	"minVitaminE": "0",
  	"maxVitaminE": "1000",
  	"minVitaminK": "0",
  	"maxVitaminK": "1000",
  	"minVitaminB1": "0",
  	"maxVitaminB1": "1000",
  	"minVitaminB2": "0",
  	"maxVitaminB2": "1000",
  	"minVitaminB3": "0",
  	"maxVitaminB3": "1000",
  	"minVitaminB5": "0",
  	"maxVitaminB5": "1000",
  	"minVitaminB6": "0",
  	"maxVitaminB6": "1000",
  	"minVitaminB12": "0",
  	"maxVitaminB12": "1000",
  	"minFiber": "0",
  	"maxFiber": "1000",
  	"minFolate": "0",
  	"maxFolate": "1000",
  	"minFolicAcid": "0",
  	"maxFolicAcid": "1000",
  	"minIodine": "0",
  	"maxIodine": "1000",
  	"minIron": "0",
  	"maxIron": "1000",
  	"minMagnesium": "0",
  	"maxMagnesium": "1000",
  	"minManganese": "0",
  	"maxManganese": "1000",
  	"minPhosphorus": "0",
  	"maxPhosphorus": "1000",
  	"minPotassium": "0",
  	"maxPotassium": "1000",
  	"minSelenium": "0",
  	"maxSelenium": "1000",
  	"minSodium": "0",
  	"maxSodium": "1000",
  	"minSugar": "0",
  	"maxSugar": "1000",
  	"minZinc": "0",
  	"maxZinc": "1000",
  	"equipment": "pan",
  	"limitLicense": "false",
  	"offset": "0",
  	"number": "30"
  };
  for (var key of Object.keys(query)) {
    toQuery[key] = query[key];
  }
  req.query(toQuery);
  return req;
}

function getByIngredients(ingredients) {
  var ingString = ingredients[0];
  for (var i = 0; i < ingredients.length-1; i++) {
    ingString += ',+' + ingredients[i];
  }

  var unirest = require("unirest");

  var req = unirest("GET", "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + ingString);
  req.query({
    "apiKey": "bc240f5675d94b39b9a096f5a949a9d7",
    'number': '20',
    'ranking': '2',
    'limitLicense': 'false',
    'ingredients': ingString
  });

  return req;
}

function searchIngredients(ingredient) {
  var unirest = require("unirest");

  var req = unirest("GET", "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + ingredient + "&number=7&metaInformation=true");

  req.query({
    "apiKey": "bc240f5675d94b39b9a096f5a949a9d7",
    "defaultCss": true
  });

  return req;
}

function visualizeNutrients(id) {
  var unirest = require("unirest");

  var req = unirest("GET", "https://api.spoonacular.com/recipes/" + id.toString() + "/nutritionWidget");

  req.query({
    "apiKey": "bc240f5675d94b39b9a096f5a949a9d7",
    "defaultCss": true
  });

  return req;
}

function visualizeIngredients(id) {
  var unirest = require("unirest");

  var req = unirest("GET", "https://api.spoonacular.com/recipes/" + id.toString() + "/ingredientWidget");

  req.query({
    "defaultCss": true
  });

  return req;
}

function parseNutrients(food) {
  nutrients = {"dateAdded": food.dateAdded};

  var arrToGoThrough = Object.values(food.bad);
  for (var nutrient of Object.values(food.good)) {arrToGoThrough.push(nutrient);}

  for (var nutrient of arrToGoThrough) {
    nutrients[nutrient.title.replace(' ', '').toLowerCase()] = parseInt(nutrient.amount.replace(/[^\d.-]/g, ''));
  }

  return nutrients;
}

io.on('connection', function(socket){
  /*var promise = getFoodParam();
  promise.end(function (res) {
  	if (res.error) {console.log(res.error);}
  	socket.emit('recommendations', res.body);
  });*/

  socket.on('displayFood', function(food) {
    socket.emit('redirect', '/foodDetails.html' + '?id=' + food.id + '&name=' + food.title);
  });

  socket.on('redirectToDetailsSuccessful', function(id) {
    var promiseById = getNutritionById(id);
    promiseById.end(function(res) {
      var update = {};
      update[id] = res.body;
      refAllFood.update(update);
      socket.emit('eatReady');
    })
  })

  socket.on('visualizeIngredients', function(id) {
    var newP = visualizeIngredients(id);
    newP.end(function(res) {
      if (res.error) {console.log(res.error);}
      socket.emit('ingredients', res.body);
    })
  });

  socket.on('visualizeNutrients', function(id) {
    var newP = visualizeNutrients(id);
    newP.end(function(res) {
      if (res.error) {console.log(res.error);}
      socket.emit('nutrients', res.body);
    })
  });

  socket.on('addToEatHistory', function(userID, foodID, nameOfFood, dateRaw) {
    var date = replaceAll(dateRaw, '/', ' ');
    refAllFood.on("value", function(snapshot) {
      var allFoods = snapshot.val();
      refEatHistory.child(userID).once('value', function(eatSnapshot) {
        var length = 0;
        if (eatSnapshot.val() !== null && !(eatSnapshot.val()[date] === undefined || eatSnapshot.val()[date] === null)) {
          length = Object.keys(eatSnapshot.val()[date]).length;
        }
        var update = {};
        update[date] = {};
        update[date][length] = allFoods[foodID];
        update[date][length].name = nameOfFood;
        update[date][length].id = foodID;
        if (eatSnapshot.val() === null) {
          var newUpdate = {};
          newUpdate[userID] = update;
          refEatHistory.update(newUpdate);
        }
        refEatHistory.child(userID).child(date).update(update[date]);
      })
    }, function (error) {
      console.log("Reading eat history failed: " + error.code);
    });
  });

  socket.on('find ingredients', function(ing) {
    var newP = searchIngredients(ing);
    newP.end(function(res) {
      if (res.error) {console.log(res.error);}
      socket.emit('ingredientsRes', res.body);
    });
  })

  socket.on('find ingredients arr', function(ingredients) {
    var unirest = require("unirest");
    var results = ingredients.map(function(ingredient) {
      return new Promise(function(resolve, reject) {
        var req = unirest("GET", "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + ingredient + "&number=1&metaInformation=true");

        req.query({
          "apiKey": "bc240f5675d94b39b9a096f5a949a9d7",
          "defaultCss": true
        });

        req.end(function(data) {
          resolve(data);
        });

        return req;
      });
    });
    Promise.all(results).then(function(result) {
      var foodsToSend = [];
      var content = result.map(function(ing) {
        if (ing.body.length > 0) {
          foodsToSend.push(ing.body[0]);
        }
        return ing.body;
      });
      socket.emit('ingredientsArrRes', foodsToSend)
    });
  })

  socket.on('save ingredient', function(userID, ing) {
    var update = {};
    update[ing.name] = ing;
    //console.log(actUpdate);
    refIngredients.child(userID).update(update);
  })

  socket.on('get stored foods', function(userID) {
    refIngredients.once("value", function(snapshot) {
      console.log('loading foods');
      if (!(snapshot.val() === undefined || snapshot.val() === null)) {
        //console.log(snapshot.val()[userID]);
        if (snapshot.val()[userID] !== null) {
          socket.emit('display stored foods', snapshot.val()[userID]);
        }
      }
    })
  })

  socket.on('get by ingredients', function(ingredients) {
    var ingProm = getByIngredients(ingredients);
    ingProm.end(function(res) {
      if (res.error) {console.log(res.error);}
      socket.emit('getByIngredientsRes', res.body);
    })
  });

  socket.on('search', function(name, query) {
    var searchProm = searchFood(name, query);
    searchProm.end(function(res) {
      if (res.error) {console.log(res.error);}
      socket.emit('searchRes', res.body.results);
    })
  })

  socket.on('sort by date', function(userID, nutrient) {
    nutrient = nutrient.toLowerCase();
    refEatHistory.once("value", function(snapshot) {
      var eatHistory = snapshot.val()[userID]
      if (eatHistory !== null) {
        var dateDict = {};
        var yearTotal = {};
        var monthTotal = {};

        for (var rawfood of Object.values(eatHistory)) {
          var food = parseNutrients(rawfood);
          console.log(food);

          var month = parseInt(food.dateAdded.split('/')[0]);
          var day = parseInt(food.dateAdded.split('/')[1]);
          var year = parseInt(food.dateAdded.split('/')[2]);

          if (!(month in yearTotal)) yearTotal[month] = 0;
          yearTotal[month] += food[nutrient];

          if (!(month in monthTotal)) monthTotal[month] = {};
          if (!(day in monthTotal[month])) monthTotal[month][day] = 0;
          monthTotal[month][day] += food[nutrient];
        }
        socket.emit('sorted by date', monthTotal, yearTotal);
      }
    })
  })

  socket.on('changeQty', function(name, newQty, newUnit, userID) {
    refIngredients.child(userID).once("value", function(snapshot) {
      if (!(snapshot.val()[name] === undefined || snapshot.val()[name] === null)) {
        var update = {};
        var toUpdate = snapshot.val()[name];
        toUpdate['qty'] = newQty;
        toUpdate['unit'] = newUnit;
        update[name] = toUpdate;
        refIngredients.child(userID).update(update);
      }
    })
  })

  socket.on('removeIngredient', function(userID, name) {
    refIngredients.child(userID).child(name).remove();
  })

  socket.on('getEatHistory', function(id) {
    refEatHistory.once("value", function(eatgensnapshot) {
      console.log('called');
      if (eatgensnapshot.val()[id] !== null && eatgensnapshot.val()[id] !== undefined) {
        console.log('user is defined');
        refEatHistory.child(id).once("value", function(eatsnapshot) {
          console.log('sending result');
          socket.emit('eatHistoryRes', eatsnapshot.val());
        })
      }
    })
  })

});

http.listen(port, function(){
  console.log('listening on port' + port.toString());
});
