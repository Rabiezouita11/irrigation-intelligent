const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriquePompoOn: function (callback){
        
        firebase.database().ref('Historique/historiquePompeOn').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}