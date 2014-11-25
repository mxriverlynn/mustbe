function UserIdentity(user, config){
  this.user = user;
  this.config = config;
  this.isAuthenticated = this.config.isAuthenticated.bind(this, user);
}

module.exports = UserIdentity;
