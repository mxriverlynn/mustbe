var express = require('express');
var mustBe = require("../../mustbe").routeHelpers();

var home = require("./home");
var admin = require("./admin");
var profile = require("./profile");
var login = require("./login");
var users = require("./users");

// Standard Routes
// ---------------

var router = express.Router();

router.use("/", home);
router.use("/login", login);
router.use("/profile", profile);
router.use("/users", users);

// Admin Routes
// ------------
// you can stack multiple mustBe rules together because
// these are just middleware route handlers. in this case
// i want to make sure you are both authenticated (logged in)
// and authorized for a given activity

// custom authorization failure handler
function adminAuthFailure(req, res, next){
  res.redirect("/?alert=please log in as an admin to view that");
}

// ensure you are authorized to "admin" things
// and add a custom authorization failure handler
router.use(
  "/admin", 
  mustBe.authenticated(),
  mustBe.authorized("admin", adminAuthFailure), 
  admin
);

// Exports
// -------

module.exports = router;
