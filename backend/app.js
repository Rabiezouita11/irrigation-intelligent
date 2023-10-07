const http = require("http");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");



const getProfile = require("./firebase/profile");
const getCapteurDepluie = require('./firebase/getCapteurDepluie');

const getCapteurNiveauDeau = require('./firebase/getCapteurNiveauDeau');

const getHistorique = require('./firebase/getHistorique');


const getHumiditerAgriculteur = require('./firebase/getHumiditerAgriculteur');


const getHumiditerSol = require('./firebase/getHumiditerSol');


const getMode = require('./firebase/getMode');

const getpompe = require('./firebase/getpompe');

const getStatusSystem = require('./firebase/getStatusSystem');


const getSystem = require('./firebase/GetSystem');
const changeMode = require('./firebase/changeMode');
const changePompe = require('./firebase/changePompe');
const changeSystem = require('./firebase/changeSystem');
const changerHumiditerAgriculture = require('./firebase/changerHumiditerAgriculture');







const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require('websocket').server;
const wsHandler = require('./websocketHandler');
const admin = require("firebase-admin");
var serviceAccount = require("../backend/iot-irrigation-smart-firebase-adminsdk-4uxxh-9a380ecbf8.json");

// firebase database config file 
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
global.__basedir = __dirname;
// how use toaster in express js

// view engine setup

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:4200"],
    credentials: true,
  })
);

// db.sequelize
//   .sync() // { force: true } will drop the table if it already exists
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });
// db.sequelize.options.logging = false;
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
; //path postman : http://localhost:3000/deletd/remove/1.jpg )

// app.use("/auth", authRouter); //path postman : http://localhost:8080/auth/login
// http://localhost:8080/users


// save data in firebase database
// app.post("/saveData/", function (req, res) {
//   fireebase.saveData(req.body,function (err,data) {

//     res.send(data);
   
//   }
//   );
// });
// how recupere data from firebase database
// app.get("/getTime/", function (req, res) {
//   getDatafirebase.getData(function (err,data) {
//     res.send(data);
//   });
// });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-irrigation-smart-default-rtdb.firebaseio.com"
});
function authenticateFirebase(req, res, next) {
  const idToken = req.headers.authorization; // The Firebase ID token passed in the request headers
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // Authentication successful, user is authenticated
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.log(error)
      // Authentication failed, unauthorized access
      res.status(401).json({ message: "Unauthorized" });
    });
}

app.get("/Profile/", authenticateFirebase, function (req, res) {
  getProfile.getProfile(function (err, initialData) {
    res.json(initialData);
  });
});

app.get("/CapteurDePluie/", authenticateFirebase, function (req, res) {
  getCapteurDepluie.getCapteurDepluie(function (err, initialData) {
    res.json(initialData);
  });
});


app.get("/CapteurDeNiveauEau/", authenticateFirebase, function (req, res) {
  getCapteurNiveauDeau.getCapteurNiveauDeau(function (err, initialData) {
    res.json(initialData);
  });
});

app.get("/Historique/", authenticateFirebase, function (req, res) {
  getHistorique.getHistorique(function (err, initialData) {
    res.json(initialData);
  });
});

app.get("/HimiditerAgriculteur/", authenticateFirebase, function (req, res) {
  getHumiditerAgriculteur.getHumiditerAgriculteur(function (err, initialData) {
    res.json(initialData);
  });
});

app.get("/HimiditerSol/", authenticateFirebase, function (req, res) {
  getHumiditerSol.getHumiditeSol(function (err, initialData) {
    res.json(initialData);
  });
});


app.get("/Mode/", authenticateFirebase, function (req, res) {
  getMode.getMode(function (err, initialData) {
    res.json(initialData);
  });
});


app.get("/Pompe/", authenticateFirebase, function (req, res) {
  getpompe.getpompe(function (err, initialData) {
    res.json(initialData);
  });
});

app.get("/StatusSystem/", authenticateFirebase, function (req, res) {
  getStatusSystem.getStatusSystem(function (err, initialData) {
    res.json(initialData);
  });
});

app.get("/System/", authenticateFirebase, function (req, res) {
  getSystem.getSystem(function (err, initialData) {
    res.json(initialData);
  });
});
app.put("/changeMode/", function (req, res) {
  changeMode.changeMode(req.body,function (err,data) {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    } else {
      res.send(data);
    }
  });
});
app.put("/changePompe/", function (req, res) {
  changePompe.changePompe(req.body,function (err,data) {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    } else {
      res.send(data);
    }
  });
});

app.put("/changeSystem/", function (req, res) {
  changeSystem.changeSystem(req.body,function (err,data) {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    } else {
      res.send(data);
    }
  });
});

app.put("/changerHumiditerAgriculture/", function (req, res) {
  changerHumiditerAgriculture.changerHumiditerAgriculture(req.body,function (err,data) {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    } else {
      res.send(data);
    }
  });
});






// });
// app.get("/getMode/", function (req, res) {
//   getMode.getMode(function (err,data) {
//     res.send(data);
//   });
// });
// app.put("/changeEtatled/", function (req, res) {
//   changeEtatled.changeEtatled(req.body,function (err,data) {
//     if (err) {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving notes.",
//       });
//     } else {
//       res.send(data);
//     }
//   });
// });
// app.put("/changeEtatPompe/", function (req, res) {
//   changeEtatPompe.updateEtatpompe(req.body,function (err,data) {
//     if (err) {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving notes.",
//       });
//     } else {
//       res.send(data);
//     }
//   });
// });
// app.put("/changeEtatventilateur/", function (req, res) {
//   changeventilateur.updateEtatventilateur(req.body,function (err,data) {
//     if (err) {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving notes.",
//       });
//     } else {
//       res.send(data);
//     }
//   });
// });

// app.put ("/SetNomCulture/", function (req, res) {
//   SetNomCulture.setNomCultrue(req.body,function (err,data) {
//     if (err) {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving notes.",
//       });
//     } else {
//       res.send(data);
//     }
//   });
// });
// app.get("/getNomCulture/", function (req, res) {
//   getNomCulture.getNomCulture(function (err,data) {
//     res.send(data);
//   });
// });


// app.put("/changeEtatMoteur/", function (req, res) {
   
//   changeEtatMoteur.updateMoteur(req.body,function (err,data) {
//     if (err) {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving notes.",
//       });
//     } else {
//       res.send(data);
//     }

//   });
// });
// app.put("/changeMode/", function (req, res) {

//     changeMode.updateMode(req.body,function (err,data) {
//       if (err) {
//         res.status(500).send({
//           message: err.message || "Some error occurred while retrieving notes.",
//         });
//       } else {
//         res.send(data);
//       }
     
      
//     });

 
// });

// app.get("/getHumiditySol/", function (req, res) {
//   getHumiditySol.getHumiditySol(function (err,data) {
//     res.send(data);
//   });
// });
// app.get("/getWaterSensor/", function (req, res) {
//   getWaterSensor.getWaterSensor(function (err,data) {
//     res.send(data);
//   });
// });

// app.get("/getcapteurPluie/", function (req, res) {
//   getcapteurPluie.getcapteurPluie(function (err,data) {
//     res.send(data);
//   });
// });
// app.get("/getCapteurCo2/", function (req, res) {
//   getCapteurCo2.getCaptureCo2(function (err,data) {
//     res.send(data);
//   });
// });

// app.get("/getStatusmanual/", function (req, res) {
//   getStatusmanual.getStatusmanual(function (err,data) {
//     res.send(data);
//   });
// });
// app.get("/getEtatbattrie/", function (req, res) {
//   getEtatbattrie.getEtatbattrie(function (err,data) {
//     res.send(data);
//   });
// });

// app.get("/getNpk/", function (req, res) {
//   getNpk.getNpk(function (err,data) {
//     res.send(data);
//   });
// });

// // how update data from firebase database
// app.put("/updateData/", function (req, res) {
//   updateDatafirebase.updateData(req.body,function (err,data) {
//     res.send(data);
//   });
// });

// http://localhost:8080/paiment

// const someDate = new Date('2022-12-07 00:49:00');
// shedule.scheduleJob(someDate, function(){
//   console.log('The world is going to end today.');
// });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.json({ error: err });
});
const server = http.createServer(app);
const wsServer = new WebSocket({ httpServer: server });

// WebSocket connection handling
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  console.log('WebSocket connection established');

  // Handle client WebSocket disconnection
  connection.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Use the WebSocket handler to handle Firebase changes
wsHandler(wsServer);

// Start the server
server.listen(5000, function () {
  console.log(`server started at 5000`);
});



 