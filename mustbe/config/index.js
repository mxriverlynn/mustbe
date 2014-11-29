var ActivityConfig = require("./activities");
var UserIdentityConfig = require("./user-identity");
var RouteHelperConfig = require("./route-helpers");
var Registry = require("../registry");

function Configurator(){
  var activities = new ActivityConfig();
  var activityRegistry = new Registry(activities);
  var identityRegistry = new Registry();
  var routeHelpers = new RouteHelperConfig();
  var userIdentity = new UserIdentityConfig();

  this.defaultPrincipal = "user";
  this.config = {
    routeHelpers: routeHelpers,
    userIdentity: userIdentity,
    validators: {},
    parameterMaps: {},
    activities: activityRegistry,
    identities: identityRegistry,
    getIdentity: function(identityTypeName){
      return this.identities.get(identityTypeName);
    }
  };
}

Configurator.prototype.getConfig = function(){
  return this.config;
};

Configurator.prototype.routeHelpers = function(cb){
  cb(this.config.routeHelpers);
};

Configurator.prototype.userIdentity = function(cb){
  cb(this.config.userIdentity);
};

Configurator.prototype.addIdentity = function(identityTypeName, IdentityType){
  this.config.identities.register(identityTypeName, IdentityType);
};

Configurator.prototype.activities = function(principalName, cb){
  if (!cb) { 
    cb = principalName;
    principalName = this.defaultPrincipal;
  }

  var activities;
  if (this.config.activities.hasValue(principalName)){
    activities = this.config.activities.get(principalName);
  } else {
    activities = new ActivityConfig();
    this.config.activities.register(principalName, activities);
  }

  cb(activities);
};

module.exports = Configurator;
