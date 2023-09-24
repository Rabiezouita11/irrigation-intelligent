const firebase = require('./firebase/firebaseConfg.js');

module.exports = (wsServer) => {
  // Function to send data to connected WebSocket clients
  function sendToClients(data) {
    wsServer.connections.forEach((connection) => {
      connection.sendUTF(JSON.stringify(data));
    });
  }

  // Listen for changes in the Firebase database
  firebase.database().ref('Air/humidite').on('value', (snapshot) => {
    const cultureData = snapshot.val();
    console.log(cultureData);

    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ cultureData });
  });
};
