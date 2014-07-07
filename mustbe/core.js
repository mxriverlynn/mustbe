var Configurator = require("./configurator");

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
  var mustBe = this;

  function handler(req, res){
    var args = Array.prototype.slice.apply(arguments);

    mustBe.config.getUser(req, function(err, user){
      if (err) { throw err; }

      var validator = mustBe.config.validators[activity];
      validator(user, {}, function(err, isAuthorized){
        if (err) { throw err; }

        if (isAuthorized){
          cb.apply(this, args);
        } else {
          mustBe.config.notAuthorized(req, res);
        }

      });
    });
  }

  return handler;
};

module.exports = MustBe;
