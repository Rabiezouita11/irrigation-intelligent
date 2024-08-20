const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistoriqueCapteurdepluie: function (callback){
        
        firebase.database().ref('Historique/historiqueCapteurDEPLUIE').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}