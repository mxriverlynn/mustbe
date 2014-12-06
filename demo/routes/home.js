var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var alert = req.query.alert;
  var message = req.query.message;
  res.render('index', {
    alert: alert,
    message: message
  });
});

module.exports = router;
