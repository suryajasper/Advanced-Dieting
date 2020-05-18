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
  showAuth();
  var id = user.uid;
  socket.emit('getEatHistory', id);
  socket.on('eatHistoryRes', function(history) {
    console.log(history);
    for (var date of Object.keys(history)) (function(date) {
      var dateheading = document.createElement('h3');
      dateheading.style.display = 'block';
      dateheading.style.color = 'rgb(0, 0, 0)';
      dateheading.innerHTML = replaceAll(date, ' ', '/');
      parent.appendChild(dateheading);

      var ul = document.createElement('ul');
      for (var food of Object.values(history[date])) (function(food) {
        if (food !== null) {
          var li = document.createElement('li');
          li.style.display = 'block';

          var sectDiv = document.createElement('div');
          sectDiv.classList.add('eatHistorySect');

          var p = document.createElement('p');
          p.style.color = "rgb(52, 52, 52)";
          p.style.display = 'inline-block';
          p.classList.add('alignleft');
          p.innerHTML = food.name;
          sectDiv.appendChild(p);

          var deleteButton = document.createElement('button');
          deleteButton.classList.add('alignright');
          deleteButton.classList.add('eatHistoryDelete');
          deleteButton.innerHTML = 'Remove';
          deleteButton.onclick = function() {
            socket.emit('removeFromEatHistory', id, date, food);
            li.remove();
          }
          sectDiv.appendChild(deleteButton);

          var clearDiv = document.createElement('div');
          clearDiv.style.clear = 'both';
          sectDiv.appendChild(clearDiv);

          li.appendChild(sectDiv);
          ul.appendChild(li);
        }
      })(food)
      parent.appendChild(ul);
    })(date)
  })
})
