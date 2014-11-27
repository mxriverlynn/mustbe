var Activities = require("./activities");
var UserIdentity = require("./user-identity");
var RouteHelpers = require("./route-helpers");
var Registry = require("../registry");

function Configurator(){
  var activities = new Activities();
  var activityRegistry = new Registry(activities);

  this.defaultPrincipal = "user";
  this.config = {
    validators: {},
    parameterMaps: {},
    activities: activityRegistry
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

Configurator.prototype.activities = function(principalName, cb){
  if (!cb) { 
    cb = principalName;
    principalName = this.defaultPrincipal;
  }

  var activities = this.config.activities.get(principalName);
  if (!activities){
    activities = new Activities();
    this.config.activities.register(principalName, activities);
  }

  cb(activities);
};

module.exports = Configurator;
