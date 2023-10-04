const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getCapteurNiveauDeau: function (callback){
        
        firebase.database().ref('System_irrigation_smart/capteur_niveau_eau/status').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}