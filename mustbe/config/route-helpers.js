var ParameterMap = require("./parameter-map");

// RouteHelpers
// ------------

function RouteHelpers(){
  this.validators = {};
}

RouteHelpers.prototype.getUser = function(cb){
  this.getUser = cb;
};

RouteHelpers.prototype.notAuthenticated = function(cb){
  this.notAuthenticated = cb;
};

RouteHelpers.prototype.notAuthorized = function(cb){
  this.notAuthorized = cb;
};

RouteHelpers.prototype.parameterMaps = function(cb){
  var parameterMap = new ParameterMap();
  cb(parameterMap);
  this.parameterMaps = parameterMap.getMaps();
};

// Exports
// -------

module.exports = RouteHelpers;
