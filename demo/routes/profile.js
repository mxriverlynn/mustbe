var express = require("express");
var mustBe = require("../../mustbe").routeHelpers();

var router = new express.Router();

// use mustBe to make sure you are authenticated
router.get("/", mustBe.authenticated(viewProfile));

function viewProfile(req, res, next){
  res.render("profile");
}

module.exports = router;
