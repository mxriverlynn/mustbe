var Activities = require("./activities");
var UserIdentity = require("./user-identity");
var RouteHelpers = require("./route-helpers");

function Configurator(){
  this.config = {
    validators: {},
    parameterMaps: {}
  };
}

Configurator.prototype.getConfig = function(){
  return this.config;
};

Configurator.prototype.routeHelpers = function(cb){
  var routeHelpers = new RouteHelpers();
  cb(routeHelpers);
  this.config.routeHelpers = routeHelpers;
};

Configurator.prototype.userIdentity = function(cb){
  var userIdentity = new UserIdentity();
  cb(userIdentity);
  this.config.userIdentity = userIdentity;
};

Configurator.prototype.activities = function(cb){
  var activities = new Activities();
  cb(activities);
  this.config.validators = activities.getValidators();
  this.config.denier = activities.denier;
  this.config.allower = activities.allower;
};

module.exports = Configurator;
