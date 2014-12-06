var User = require("../lib/user");
var express = require("express");

var router = new express.Router();

router.get("/", function(req, res, next){
  res.render("login");
});

router.get("/logout", function(req, res, next){
  res.clearCookie("usercookie");
  res.redirect("/?message=you are logged out now");
});

router.post("/", function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  User.login(username, password, function(err, user){
    if (err) { return next; }

    // store cookie for later use
    if (user){
      res.cookie("usercookie", username);
    }

    res.redirect("/?message=you are logged in!");
  });
  
});

module.exports = router;
