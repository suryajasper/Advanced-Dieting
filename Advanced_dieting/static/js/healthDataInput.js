var presetSelect = document.getElementById("preset");
var reduce = document.getElementById("reduce");
var gain = document.getElementById("gain");
var submitButton = document.getElementById("submitButton");

submitButton.onclick = function() {
  toReduce = reduce.children;
  toGain = gain.children;
  
  console.log(presetSelect.value);
  for (var i = 1; i < toReduce.length; i += 2) {
    console.log(toReduce[i].checked);
  }
  for (var i = 1; i < toGain.length; i += 2) {
    console.log(toGain[i].checked);
  }
};
