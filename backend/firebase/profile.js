const firebase =  require('./firebaseConfg.js');

module.exports={


    
    getProfile: function (callback){
        
        firebase.database().ref('Profile/').once('value', function(snapshot) {
            callback(null, snapshot.val());
            
        });
    }
}