var Activities = require("./activities");
var ParameterMap = require("./parameter-map");

function Configurator(){
  this.config = {
    validators: {},
    parameterMaps: {}
  };
}

Configurator.prototype.getConfig = function(){
  return this.config;
};

Configurator.prototype.getUser = function(cb){
  this.config.getUser = cb;
};

Configurator.prototype.isAuthenticated = function(cb){
  this.config.isAuthenticated = cb;
};

Configurator.prototype.notAuthenticated = function(cb){
  this.config.notAuthenticated = cb;
};

Configurator.prototype.notAuthorized = function(cb){
  this.config.notAuthorized = cb;
};

Configurator.prototype.activities = function(cb){
  var activities = new Activities();
  cb(activities);
  this.config.validators = activities.getValidators();
};

Configurator.prototype.parameterMap = function(cb){
  var parameterMap = new ParameterMap();
  cb(parameterMap);
  this.config.parameterMaps = parameterMap.getMaps();
};

module.exports = Configurator;
