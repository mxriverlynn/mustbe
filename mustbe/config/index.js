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

  this.defaultIdentityType = "user";
  this.config = {
    routeHelpers: this.routeHelpersConfig.config,
    userIdentity: this.userIdentityConfig.config,
    validators: {},
    activities: this.activityRegistry,
    identities: this.identityRegistry,
    getActivities: function(identityTypeName){
      var activitiesConfig = that.activityRegistry.get(identityTypeName);
      var activities;
      if (activitiesConfig) {
        activities = activitiesConfig.config;
      }
      return activities;
    },
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

Configurator.prototype.activities = function(identityTypeName, cb){
  if (!cb) { 
    cb = identityTypeName;
    identityTypeName = this.defaultIdentityType;
  }

  var activityConfig;
  if (this.activityRegistry.hasValue(identityTypeName)){
    activityConfig = this.activityRegistry.get(identityTypeName);
  } else {
    activityConfig = new ActivityConfig();
    this.activityRegistry.register(identityTypeName, activityConfig);
  }

  cb(activityConfig);
};

module.exports = Configurator;
