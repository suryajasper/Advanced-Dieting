var presetSelect = document.getElementById("preset");
var reduce = document.getElementById("reduce");
var gain = document.getElementById("gain");
var submitButton = document.getElementById("submitButton");

submitButton.onclick = function() {
  toReduce = reduce.children;
  toGain = gain.children;
  console.log(toReduce);
  console.log(toGain);
  for (var i = 1; i < toReduce.length; i += 2) {
    
  }
};
