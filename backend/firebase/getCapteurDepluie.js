const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getCapteurDepluie: function (callback){
        
        firebase.database().ref('System_irrigation_smart/Captuer_de_pluie/status').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}