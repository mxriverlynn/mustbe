var express = require("express");
var mustBe = require("../../mustbe").routeHelpers();

var router = new express.Router();

// use mustBe to make sure you are authorized
router.get("/", mustBe.authorized("users.view", viewUsers));

function viewUsers(req, res, next){
  res.render("users");
}

module.exports = router;
