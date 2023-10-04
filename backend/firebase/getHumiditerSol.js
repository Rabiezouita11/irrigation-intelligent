const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHumiditeSol: function (callback){
        
        firebase.database().ref('System_irrigation_smart/humidite_du_sol/value').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}