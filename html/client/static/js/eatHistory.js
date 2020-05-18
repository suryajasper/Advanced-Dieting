var socket = io();
initializeFirebase();

firebase.auth().onAuthStateChanged = function(user) {
  var id = user.uid;
  socket.emit('getEatHistory', user);
  socket.on('eatHistoryRes', function(history) {
    
  })
}
