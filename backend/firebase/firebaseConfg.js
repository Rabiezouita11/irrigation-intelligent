const firebase = require("firebase");
const app = firebase.initializeApp({
    apiKey: "AIzaSyCba_eDDCMY7-vQREAOJY4w_DQB1_PB28A",
    authDomain: "iot-irrigation-smart.firebaseapp.com",
    databaseURL: "https://iot-irrigation-smart-default-rtdb.firebaseio.com/",
});
module.exports = app;