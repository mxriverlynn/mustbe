var Verifier = require("../verifier");
var Principal = require("../principals");
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
    notAuthCB = this.config.routeHelpers.notAuthenticated;
  }

  function handler(req, res, next){
    var args = Array.prototype.slice.apply(arguments);

    config.routeHelpers.getUser(req, function(err, user){
      if (err) { return next(err); }

      var userIdentity = new UserIdentity(user, config);
      var verifier = new Verifier(userIdentity, config);
      var principal = new Principal(userIdentity, verifier);
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

RouteHelpers.prototype.authorizeIdentity = function(identityTypeName, activity, authcb, notauthcb){
  var that = this;
  return this._handleAuthorization(activity, authcb, notauthcb, function(req, config, cb){
    var identity = that.getIdentity(identityTypeName, config);
    cb(null, identity);
  });
};

RouteHelpers.prototype.authorized = function(activity, authcb, notauthcb){
  return this._handleAuthorization(activity, authcb, notauthcb, function(req, config, cb){
    config.routeHelpers.getUser(req, function(err, user){
      if (err) { return cb(err); }

      var identity = new UserIdentity(user, config);
      cb(null, identity);
    });
  });
};

RouteHelpers.prototype._handleAuthorization = function(activity, authcb, notauthcb, getIdentitycb){
  var that = this;
  var config = this.config;

  if (!notauthcb){
    notauthcb = config.routeHelpers.notAuthorized;
  }

  if (!authcb){
    authcb = activity;
    activity = undefined;
  }

  return function(req, res, next){
    var handlerArgs = Array.prototype.slice.apply(arguments);
    
    getIdentitycb(req, config, function(err, identity){
      if (err) { return next(err); }

      var params = paramsFromRequest(req, config.routeHelpers, activity);
      var verifier = new Verifier(identity, config);
      var principal = new Principal(identity, verifier);

      principal.isAuthorized(activity, params, function(err, isAuth){
        if (err) { return next(err); }

        if (isAuth) { 
          return authcb.apply(undefined, handlerArgs);
        } else {
          return notauthcb.apply(undefined, handlerArgs);
        }
      });
    });
  };
};

RouteHelpers.prototype.getIdentity = function(identityTypeName, config){
  var IdentityType = config.getIdentity(identityTypeName, config);
  if (!IdentityType){
    var noIdErr = new Error("Identity Not Found, " + identityTypeName);
    noIdErr.name = "IdentityNotFoundException";
    throw noIdErr;
  }
  return new IdentityType(config);
};

module.exports = RouteHelpers;
