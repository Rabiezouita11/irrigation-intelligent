const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriquePompoOn: function (callback){
        
        firebase.database().ref('System_irrigation_smart/historiquePompeOn').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}