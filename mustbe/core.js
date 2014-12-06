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
  var IdentityType = this.config.getIdentity(identityTypeName);
  if (!IdentityType){
    var noIdErr = new Error("Identity Not Found, " + identityTypeName);
    noIdErr.name = "IdentityNotFoundException";
    throw noIdErr;
  }
  return new IdentityType(this.config);
};

module.exports = MustBe;
