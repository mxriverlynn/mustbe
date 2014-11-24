var RSVP = require("rsvp");

var RequestUserPrincipal = require("../principals/requestUserPrincipal");

// Route Helpers
// -------------

function RouteHelpers(config){
  this.config = config;
}

RouteHelpers.prototype.authenticated = function(cb, failure){
  var that = this;
  var config = this.config;

  if (!failure){
    failure = that.config.notAuthenticated;
  }

  function handler(req, res, next){
    var args = Array.prototype.slice.apply(arguments);

    var principal = new RequestUserPrincipal(req, config);
    principal.isAuthenticated(function(err, isAuth){
      if (err) { return next(err); }

      if (isAuth){
        cb.apply(undefined, args);
      } else {
        failure.apply(undefined, args);
      }
    });
  }

  return handler;
};

RouteHelpers.prototype.authorized = function(activity, cb, failure){
  var that = this;
  var config = this.config;

  if (!failure){
    failure = config.notAuthorized;
  }

  if (!cb){
    cb = activity;
    activity = undefined;
  }

  return function(req, res, next){
    var routeHandler = this;
    var handlerArgs = Array.prototype.slice.apply(arguments);
    
    var principal = new RequestUserPrincipal(req, config);
    principal.isAuthorized(activity, function(err, isAuth){
      if (isAuth) { 
        return cb.apply(undefined, handlerArgs);
      } else {
        return failure.apply(undefined, handlerArgs);
      }
    });
  };
};

module.exports = RouteHelpers;
