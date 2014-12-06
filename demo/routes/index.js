var express = require('express');
var mustBe = require("../../mustbe").routeHelpers();

var home = require("./home");
var admin = require("./admin");
var profile = require("./profile");
var login = require("./login");
var users = require("./users");

var router = express.Router();

router.use("/", home);
router.use("/login", login);
router.use("/profile", profile);
router.use("/users", users);

// you can stack multiple mustBe rules together because
// these are just middleware route handlers. in this case
// i want to make sure you are both authenticated (logged in)
// and authorized for a given activity
var adminRouteRules = mustBe.authenticated(
  // ensure you are authorized to "admin" things
  // and add a custom authorization failure handler
  mustBe.authorized("admin", admin, adminAuthFailure)
);

// custom authorization failure handler
function adminAuthFailure(req, res, next){
  res.redirect("/?alert=please log in as an admin to view that");
}

// mustbe as middleware for an entire route
router.use("/admin", adminRouteRules);


module.exports = router;
