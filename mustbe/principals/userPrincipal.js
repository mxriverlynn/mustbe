var RSVP = require("rsvp");

// helpers
// -------

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
function UserPrincipal(user, config, params){
  this.user = user;
  this.requestParams = params;
  this.config = config;
}

UserPrincipal.prototype.isAuthenticated = function(cb){
  this.config.isAuthenticated(this.user, cb);
};

UserPrincipal.prototype.isAuthorized = function(activity, cb){
  var that = this;
  var config = this.config;
  var requestParams = this.requestParams;
  var user = this.user;

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

    validator(user, requestParams, function(err, isAuthorized){
      if (err) { return cb(err); }

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

};

module.exports = UserPrincipal;
