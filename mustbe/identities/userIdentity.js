function UserIdentity(user, config){
  this.user = user;
  this.config = config;
}

UserIdentity.prototype.isAuthenticated = function(cb){
  var user = this.user;
  var isAuth = this.config.userIdentity.isAuthenticated;
  return isAuth.call(this, user, cb);
};

UserIdentity.prototype.type = "user";

module.exports = UserIdentity;
