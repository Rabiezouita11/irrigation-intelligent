const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHumiditerAgriculteur: function (callback){
        
        firebase.database().ref('humiditer_agriculteur/status').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}