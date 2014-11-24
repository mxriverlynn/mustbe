var RSVP = require("rsvp");
// helpers
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

// http request, user principal
// ----------------------------
function RequestUserPrincipal(req, config){
  this.req = req;
  this.config = config;
}

RequestUserPrincipal.prototype.isAuthenticated = function(cb){
  this.config.getUser(this.req, function(err, user){
    if (err) { return cb(err); }
    this.config.isAuthenticated(user, cb);
  });
};

RequestUserPrincipal.prototype.isAuthorized = function(activity, cb){
  var that = this;
  var config = this.config;

  config.getUser(this.req, function(err, user){
    if (err) { return cb(err); }

    var override = handleOverrides(config, user, activity);
    override.then(function(overrideArgs){
      var isDenied = overrideArgs[0];
      var isAllowed = overrideArgs[1];

      // handle overrides
      
      if (isDenied){
        // denied, isAuth = false;
        return cb(null, false);
      }

      if (isAllowed){
        // allowed, isAuth = true;
        return cb(null, true);
      }

      // handle validation of authorization

      var validator = config.validators[activity];
      if (!validator){
        // denied, isAuth = false;
        return cb(null, false);
      }

      var params = getParameterMap(this.req, config, activity);
      validator(user, params, function(err, isAuthorized){
        if (err) { throw err; }

        if (isAuthorized){
          // allowed, isAuth = true;
          return cb(null, true);
        } else {
          // denied, isAuth = false;
          return cb(null, false);
        }

      });
    }).then(undefined, function(err){
      return cb(err);
    });

  });
};

module.exports = RequestUserPrincipal;
