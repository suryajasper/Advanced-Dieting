var socket = io();
initializeFirebase();

var parent = document.getElementById('stuff');

function replaceAll(string, part, newPart) {
  string = string.replace(part, newPart);
  while (string.indexOf(part) !== -1) {
    string = string.replace(part, newPart);
  }
  return string;
}

firebase.auth().onAuthStateChanged(function(user) {
  var id = user.uid;
  socket.emit('getEatHistory', id);
  socket.on('eatHistoryRes', function(history) {
    for (var date of Object.keys(history)) {
      var dateheading = document.createElement('h3');
      dateheading.style.display = 'block';
      dateheading.innerHTML = replaceAll(date, ' ', '/');
      parent.appendChild(dateheading);

      for (var food of Object.values(history[date])) {
        var p = document.createElement('p');
        p.style.display = 'block';
        p.innerHTML = food.name;
        parent.appendChild(p);
      }
    }
  })
})
