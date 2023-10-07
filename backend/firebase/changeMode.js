const firebase = require("./firebaseConfg.js");

module.exports={
    changeMode: (req, callback) => {
            let mode = req.mode;
            firebase.database().ref("Mode/").update({
                status: mode

            });
            callback (null, "Data updated successfully");
    }
}