const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriqueWaterNiveauSensor: function (callback){
        
        firebase.database().ref('Historique/historiqueCapteurdeWaterlevel').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}