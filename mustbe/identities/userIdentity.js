function UserIdentity(user, config){
  this.user = user;
  this.config = config;
  this.isAuthenticated = this.config.userIdentity.isAuthenticated.bind(this, user);
}

UserIdentity.prototype.type = "user";

module.exports = UserIdentity;
