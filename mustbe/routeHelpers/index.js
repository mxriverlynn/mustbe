var RSVP = require("rsvp");

var RequestUserPrincipal = require("../principals/requestUserPrincipal");

// Helpers
// -------

function getParameterMap(req, config, activity){
  var params;
  var parameterMap = config.parameterMaps[activity];
  if (parameterMap){
    params = parameterMap(req);
  }
  return params;
}

function handleOverrides(config, user, activity){
  var denierPromise = new RSVP.Promise(function(resolve, reject){
    var denier = config.denier;
    if (!denier){ 
      return resolve(false); 
    }

    denier(user, activity, function(err, isDenied){
      if (err) { reject(err); }
      resolve(isDenied);
    });
  });

  var allowerPromise = new RSVP.Promise(function(resolve, reject){
    var allower = config.allower;
    if (!allower){
      return resolve(false);
    }

    allower(user, activity, function(err, isAllowed){
      if (err) { reject(err); }
      resolve(isAllowed);
    });
  });

  return RSVP.all([denierPromise, allowerPromise]);
}

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

  if (!failure){
    failure = that.config.notAuthorized;
  }

  if (!cb){
    cb = activity;
    activity = undefined;
  }

  return function(req, res, next){
    var routeHandler = this;
    var handlerArgs = Array.prototype.slice.apply(arguments);

    that.config.getUser(req, function(err, user){
      if (err) { throw err; }

      var override = handleOverrides(that.config, user, activity, cb);
      override.then(function(overrideArgs){
        var isDenied = overrideArgs[0];
        var isAllowed = overrideArgs[1];

        // handle overrides
        
        if (isDenied){
          return failure(req, res, next);
        }

        if (isAllowed){
          return cb.apply(routeHandler, handlerArgs);
        }

        // handle validation of authorization

        var validator = that.config.validators[activity];
        if (!validator){
          return failure(req, res, next);
        }

        var params = getParameterMap(req, that.config, activity);
        validator(user, params, function(err, isAuthorized){
          if (err) { throw err; }

          if (isAuthorized){
            return cb.apply(routeHandler, handlerArgs);
          } else {
            return failure(req, res, next);
          }

        });
      }).then(undefined, function(err){
        next(err);
      });

    });
  };
};

module.exports = RouteHelpers;
