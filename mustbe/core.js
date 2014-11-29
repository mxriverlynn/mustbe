var RSVP = require("rsvp");

var Configurator = require("./config");
var RouteHelpers = require("./routeHelpers");

// MustBe Core
// -----------

function MustBe(){
}

MustBe.prototype.configure = function(cb){
  var configurator = new Configurator();
  cb(configurator);
  this.config = configurator.getConfig();
};

MustBe.prototype.routeHelpers = function(){
  var routeHelpers = new RouteHelpers(this.config);
  return routeHelpers;
};

MustBe.prototype.getIdentity = function(identityTypeName){
  return this.config.getIdentity(identityTypeName);
};

module.exports = MustBe;
