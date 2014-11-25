var RSVP = require("rsvp");

var UserPrincipal = require("../principals/userPrincipal");
var UserIdentity = require("../identities/userIdentity");

function paramsFromRequest(req, config, activity){
  var params;
  var parameterMap = config.parameterMaps[activity];
  if (parameterMap){
    params = parameterMap(req);
  }
  return params;
}


// Route Helpers
// -------------

function RouteHelpers(config){
  this.config = config;
}

RouteHelpers.prototype.authenticated = function(authCB, notAuthCB){
  var that = this;
  var config = this.config;

  if (!notAuthCB){
    notAuthCB = this.config.notAuthenticated;
  }

  function handler(req, res, next){
    var args = Array.prototype.slice.apply(arguments);

    config.getUser(req, function(err, user){
      if (err) { return next(err); }

      var userIdentity = new UserIdentity(user, config);
      var principal = new UserPrincipal(userIdentity, config);
      principal.isAuthenticated(function(err, isAuth){
        if (err) { return next(err); }

        if (isAuth){
          authCB.apply(undefined, args);
        } else {
          notAuthCB.apply(undefined, args);
        }
      });

    });
  }

  return handler;
};

RouteHelpers.prototype.authorized = function(activity, authcb, notauthcb){
  var that = this;
  var config = this.config;

  if (!notauthcb){
    notauthcb = config.notAuthorized;
  }

  if (!authcb){
    authcb = activity;
    activity = undefined;
  }

  return function(req, res, next){
    var handlerArgs = Array.prototype.slice.apply(arguments);
    
    config.getUser(req, function(err, user){
      if (err) { return next(err); }

      var params = paramsFromRequest(req, config, activity);
      var userIdentity = new UserIdentity(user, config);
      var principal = new UserPrincipal(userIdentity, config, params);

      principal.isAuthorized(activity, function(err, isAuth){
        if (isAuth) { 
          return authcb.apply(undefined, handlerArgs);
        } else {
          return notauthcb.apply(undefined, handlerArgs);
        }
      });

    });
  };
};

module.exports = RouteHelpers;
