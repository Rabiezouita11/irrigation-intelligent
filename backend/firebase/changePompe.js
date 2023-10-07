const firebase = require("./firebaseConfg.js");

module.exports={
    changePompe: (req, callback) => {
            let pompe = req.pompe;
            firebase.database().ref("System_irrigation_smart/pompe/").update({
                status: pompe

            });
            callback (null, "Data updated successfully");
    }
}