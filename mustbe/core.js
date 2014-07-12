var Configurator = require("./configurator");
var RSVP = require("rsvp");

function MustBe(){
}

MustBe.prototype.use = function(app){

};

MustBe.prototype.configure = function(cb){
  var configurator = new Configurator();
  cb(configurator);
  this.config = configurator.getConfig();
};

MustBe.prototype.authenticated = function(cb){
  var mustBe = this;

  function handler(req, res){
    var args = Array.prototype.slice.apply(arguments);

    mustBe.config.getUser(req, function(err, user){
      if (err) { throw err; }

      mustBe.config.isAuthenticated(user, function(err, isAuth){
        if (err) { throw err; }

        if (isAuth){
          cb.apply(this, args);
        } else {
          mustBe.config.notAuthenticated(req, res);
        }

      });
    });
  }

  return handler;
};

MustBe.prototype.authorized = function(activity, cb){
  if (!cb){
    cb = activity;
    activity = undefined;
  }

  var mustBe = this;

  return function(req, res){
    var routeHandler = this;
    var args = Array.prototype.slice.apply(arguments);

    mustBe.config.getUser(req, function(err, user){
      if (err) { throw err; }

      var params;
      var parameterMap = mustBe.config.parameterMaps[activity];
      if (parameterMap){
        params = parameterMap(req);
      }

      var denierPromise = new RSVP.Promise(function(resolve, reject){
        var denier = mustBe.config.denier;
        if (!denier){ 
          return resolve(false); 
        }

        denier(user, activity, function(err, isDenied){
          if (err) { reject(err); }
          resolve(isDenied);
        });
      });

      var allowerPromise = new RSVP.Promise(function(resolve, reject){
        var allower = mustBe.config.allower;
        if (!allower){
          return resolve(false);
        }

        allower(user, activity, function(err, isAllowed){
          if (err) { reject(err); }
          resolve(isAllowed);
        });
      });

      denierPromise.then(function(isDenied){
        if (isDenied){
          return mustBe.config.notAuthorized(req, res);
        }

        return allowerPromise;
      }).then(function(isAllowed){
        if (isAllowed){
          return cb.apply(routeHandler, args);
        }
      }).then(function(){
        var validator = mustBe.config.validators[activity];

        if (!validator){
          return mustBe.config.notAuthorized(req, res);
        }

        validator(user, params, function(err, isAuthorized){
          if (err) { throw err; }

          if (isAuthorized){
            return cb.apply(routeHandler, args);
          } else {
            return mustBe.config.notAuthorized(req, res);
          }

        });
      }).then(undefined, function(err){
        res.send(500, {});
        setTimeout(function(){
          throw err;
        }, 0);
      });

    });
  };
};

module.exports = MustBe;
