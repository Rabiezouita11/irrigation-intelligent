const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getpompe: function (callback){
        
        firebase.database().ref('System_irrigation_smart/pompe/status').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}