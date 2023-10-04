const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getStatusSystem: function (callback){
        
        firebase.database().ref('Status_du_system/status').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}