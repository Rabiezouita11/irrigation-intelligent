const firebase = require("./firebaseConfg.js");

module.exports={
    changeSystem: (req, callback) => {
            let System = req.System;
            firebase.database().ref("System/").update({
                status: System

            });
            callback (null, "Data updated successfully");
    }
}