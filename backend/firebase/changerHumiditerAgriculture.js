const firebase = require("./firebaseConfg.js");

module.exports={
    changerHumiditerAgriculture: (req, callback) => {
            let status = req.status;
            firebase.database().ref("humiditer_agriculteur/").update({
                status: status

            });
            callback (null, "Data updated successfully");
    }
}