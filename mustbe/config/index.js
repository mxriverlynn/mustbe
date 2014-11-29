var ActivityConfig = require("./activities");
var UserIdentityConfig = require("./user-identity");
var RouteHelperConfig = require("./route-helpers");
var Registry = require("../registry");

function Configurator(){
  var that = this;
  var defaultActivities = new ActivityConfig();
  this.activityRegistry = new Registry(defaultActivities);
  this.identityRegistry = new Registry();
  this.routeHelpersConfig = new RouteHelperConfig();
  this.userIdentityConfig = new UserIdentityConfig();

  this.defaultPrincipal = "user";
  this.config = {
    routeHelpers: this.routeHelpersConfig.config,
    userIdentity: this.userIdentityConfig,
    validators: {},
    activities: this.activityRegistry,
    identities: this.identityRegistry,
    getIdentity: function(identityTypeName){
      return that.identityRegistry.get(identityTypeName);
    }
  };
}

Configurator.prototype.getConfig = function(){
  return this.config;
};

Configurator.prototype.routeHelpers = function(cb){
  cb(this.routeHelpersConfig);
};

Configurator.prototype.userIdentity = function(cb){
  cb(this.userIdentityConfig);
};

Configurator.prototype.addIdentity = function(identityTypeName, IdentityType){
  this.identityRegistry.register(identityTypeName, IdentityType);
};

Configurator.prototype.activities = function(principalName, cb){
  if (!cb) { 
    cb = principalName;
    principalName = this.defaultPrincipal;
  }

  var activities;
  if (this.activityRegistry.hasValue(principalName)){
    activities = this.activityRegistry.get(principalName);
  } else {
    activities = new ActivityConfig();
    this.activityRegistry.register(principalName, activities);
  }

  cb(activities);
};

module.exports = Configurator;
