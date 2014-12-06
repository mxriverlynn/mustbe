var express = require('express');
var mustBe = require("../../mustbe").routeHelpers();

var home = require("./home");
var admin = require("./admin");
var profile = require("./profile");
var login = require("./login");

var router = express.Router();

router.use("/", home);
router.use("/login", login);
router.use("/profile", profile);
router.use("/admin", mustBe.authorized("admin", admin, mustBeAdmin));

function mustBeAdmin(req, res, next){
  res.redirect("/?alert=please log in as an admin to view that");
}

module.exports = router;
