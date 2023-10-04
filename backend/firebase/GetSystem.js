const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getSystem: function (callback){
        
        firebase.database().ref('System/status').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}