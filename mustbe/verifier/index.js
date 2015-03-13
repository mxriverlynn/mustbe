var RSVP = require("rsvp");

// helpers
// -------

function handleOverrides(config, identity, activity){
  var denierPromise = new RSVP.Promise(function(resolve, reject){
    var denier = config.denier;
    if (!denier){ 
      return resolve(false); 
    }

    denier(identity, activity, function(err, isDenied){
      if (err) { reject(err); }
      resolve(isDenied);
    });
  });

  var allowerPromise = new RSVP.Promise(function(resolve, reject){
    var allower = config.allower;
    if (!allower){
      return resolve(false);
    }

    allower(identity, activity, function(err, isAllowed){
      if (err) { reject(err); }
      resolve(isAllowed);
    });
  });

  return RSVP.all([denierPromise, allowerPromise]);
}

// Verifier
// --------

function Verifier(identity, config){
  this.identity = identity;
  this.config = config;
  this.activities = config.getActivities(identity.type);
}

Verifier.prototype.isAuthorized = function(activity, requestParams, cb){
  var that = this;
  var config = this.config;
  var identity = this.identity;

  var validators = this.activities.validators;
  var denyAllowConfig = {
    denier: this.activities.denier,
    allower: this.activities.allower
  };

  var override = handleOverrides(denyAllowConfig, identity, activity);
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

    var validator = validators[activity];
    if (!validator){
      var noActivityError = new Error("Activity Not Found, " + activity);
      noActivityError.name = "ActivityNotFoundException";
      return cb(noActivityError, false);
    }

    validator(identity, requestParams, function(err, isAuthorized){
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

module.exports = Verifier;
