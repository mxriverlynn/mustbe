var Configurator = require("./configurator");
var RSVP = require("rsvp");

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

// MustBe Core
// -----------

function MustBe(){
}

MustBe.prototype.configure = function(cb){
  var configurator = new Configurator();
  cb(configurator);
  this.config = configurator.getConfig();
};

MustBe.prototype.authenticated = function(cb, failure){
  var mustBe = this;

  if (!failure){
    failure = mustBe.config.notAuthenticated;
  }

  function handler(req, res, next){
    var args = Array.prototype.slice.apply(arguments);

    mustBe.config.getUser(req, function(err, user){
      if (err) { throw err; }

      mustBe.config.isAuthenticated(user, function(err, isAuth){
        if (err) { throw err; }

        if (isAuth){
          cb.apply(this, args);
        } else {
          failure(req, res, next);
        }

      });
    });
  }

  return handler;
};

MustBe.prototype.authorized = function(activity, cb, failure){
  var mustBe = this;

  if (!failure){
    failure = mustBe.config.notAuthorized;
  }

  if (!cb){
    cb = activity;
    activity = undefined;
  }

  return function(req, res, next){
    var routeHandler = this;
    var handlerArgs = Array.prototype.slice.apply(arguments);

    mustBe.config.getUser(req, function(err, user){
      if (err) { throw err; }

      var override = handleOverrides(mustBe.config, user, activity, cb);
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

        var validator = mustBe.config.validators[activity];
        if (!validator){
          return failure(req, res, next);
        }

        var params = getParameterMap(req, mustBe.config, activity);
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

module.exports = MustBe;
