const firebase = require('./firebase/firebaseConfg.js');
const getHumiditerAgriculteur = require('./firebase/getHumiditerAgriculteur');

module.exports = (wsServer) => {
  // Function to send data to connected WebSocket clients
  function sendToClients(data) {
    wsServer.connections.forEach((connection) => {
      connection.sendUTF(JSON.stringify(data));
    });
  }

 
  firebase.database().ref('System_irrigation_smart/Captuer_de_pluie/status').on('value', (snapshot) => {
    const getCapteurDepluie = snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ getCapteurDepluie });
  });

  firebase.database().ref('Status_du_system/status').on('value', (snapshot) => {
    const getStatusSystem= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ getStatusSystem });
  });

  firebase.database().ref('System_irrigation_smart/Captuer_de_pluie/status').on('value', (snapshot) => {
    const getCapteurDepluie= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ getCapteurDepluie });
  });

  firebase.database().ref('Historique/historiquePompeOn').on('value', (snapshot) => {
    const getHistoriquePompoOn= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
  //  console.log("Data getHistoriquePompoOngetHistoriquePompoOngetHistoriquePompoOn:", getHistoriquePompoOn);  // Log the data to the console

    sendToClients({ getHistoriquePompoOn });
  });

  firebase.database().ref('Historique/historiqueCapteurDEPLUIE').on('value', (snapshot) => {
    const getHistoriqueCapteurdepluie= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
  //  console.log("Data getHistoriquePompoOngetHistoriquePompoOngetHistoriquePompoOn:", getHistoriquePompoOn);  // Log the data to the console

    sendToClients({ getHistoriqueCapteurdepluie });
  });

  firebase.database().ref('Historique/historiqueCapteurdeWaterlevel').on('value', (snapshot) => {
    const getHistoriqueWaterNiveauSensor= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
  //  console.log("Data getHistoriquePompoOngetHistoriquePompoOngetHistoriquePompoOn:", getHistoriquePompoOn);  // Log the data to the console

    sendToClients({ getHistoriqueWaterNiveauSensor });
  });

  firebase.database().ref('Historique/historiquePompe').on('value', (snapshot) => {
    const getHistoriquePompewithcondiitons= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
  //  console.log("Data getHistoriquePompoOngetHistoriquePompoOngetHistoriquePompoOn:", getHistoriquePompoOn);  // Log the data to the console

    sendToClients({ getHistoriquePompewithcondiitons });
  });

  firebase.database().ref('Historique/historiquePompeOff').on('value', (snapshot) => {
    const getHistoriquePompoOff= snapshot.val();
 
    sendToClients({ getHistoriquePompoOff });
  });
  
  firebase.database().ref('System_irrigation_smart/capteur_niveau_eau/status').on('value', (snapshot) => {
    const getCapteurNiveauDeau= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ getCapteurNiveauDeau });
  });


  firebase.database().ref('System_irrigation_smart/humidite_du_sol/value').on('value', (snapshot) => {
    const getHumiditerSol= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ getHumiditerSol });
  });


  firebase.database().ref('System_irrigation_smart/pompe/status').on('value', (snapshot) => {
    const getpompe= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes
    sendToClients({ getpompe });
  });
  firebase.database().ref('Satistique/Pompe').on('value', (snapshot) => {
    const getSatistiquePompe= snapshot.val();
    // Send the initial culture data to WebSocket clients when it changes

    sendToClients({ getSatistiquePompe });
  });

  

};
