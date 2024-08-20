const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriquePompewithcondiitons: function (callback){
        
        firebase.database().ref('Historique/historiquePompe').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}