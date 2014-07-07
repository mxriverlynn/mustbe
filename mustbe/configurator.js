var Activities = require("./activities");

function Configurator(){
  this.config = {};
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

module.exports = Configurator;
