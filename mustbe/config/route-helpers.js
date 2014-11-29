var ParameterMap = require("./parameter-map");

// Helpers
// -------

function noGetUser(req, cb){
  var noGetUserError = new Error("You must specify a getUser method on the mustBe config.routeHelpers");
  noGetUserError.name = "NoGetUserMethodException";
  cb(noGetUserError);
}

// RouteHelpers
// ------------

function RouteHelpers(){
  this.config = {
    validators: {},
    getUser: noGetUser,
    parameterMaps: {}
  };
}

RouteHelpers.prototype.getUser = function(cb){
  this.config.getUser = cb;
};

RouteHelpers.prototype.notAuthenticated = function(cb){
  this.config.notAuthenticated = cb;
};

RouteHelpers.prototype.notAuthorized = function(cb){
  this.config.notAuthorized = cb;
};

RouteHelpers.prototype.parameterMaps = function(cb){
  var parameterMap = new ParameterMap();
  cb(parameterMap);
  this.config.parameterMaps = parameterMap.getMaps();
};

// Exports
// -------

module.exports = RouteHelpers;
