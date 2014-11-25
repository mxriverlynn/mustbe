function UserIdentity(user, config){
  this.user = user;
  this.config = config;
}

UserIdentity.prototype.isAuthenticated = function(cb){
  return this.config.isAuthenticated(this.user, cb);
};

module.exports = UserIdentity;
