var express = require("express");
var mustBe = require("../../mustbe").routeHelpers();

var router = new express.Router();
router.get("/", mustBe.authorized("view.profile", viewProfile));

function viewProfile(req, res, next){
  res.render("profile");
}

module.exports = router;
