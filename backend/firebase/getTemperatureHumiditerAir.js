const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getTemperatureAir: function (callback){
        
        firebase.database().ref('humiditer sol/humiditer').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}