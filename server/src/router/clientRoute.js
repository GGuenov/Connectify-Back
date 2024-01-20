const clientRoute = require("express").Router();

const clientRegister = require("../controllers/Client/clientRegister");
const clientLogin = require("../controllers/Client/clientLogin");
const clientUpdate = require("../controllers/Client/clientUpdate");
const clientDelete = require("../controllers/Client/clientDelete");
const getAllClients = require("../controllers/Client/getAllClients");
const clientGoogleLogin = require("../controllers/Client/loginGoogleRegister");

clientRoute.post("/register", clientRegister);

clientRoute.post("/login", clientLogin);

clientRoute.get("/", getAllClients);

clientRoute.patch("/:id", clientUpdate);

clientRoute.patch("/:id/delete", clientDelete);

clientRoute.post("/googlelogin", clientGoogleLogin);

module.exports = clientRoute;
