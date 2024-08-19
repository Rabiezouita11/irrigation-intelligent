const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriquePompoOff: function (callback){
        
        firebase.database().ref('Historique/historiquePompeOff').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}