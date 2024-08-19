const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriquePompoOff: function (callback){
        
        firebase.database().ref('System_irrigation_smart/historiquePompeOff').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}