const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getHistorique: function (callback){
        
        firebase.database().ref('historique/exemple').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}