function UserIdentity(){
  this.config = {};
}

UserIdentity.prototype.isAuthenticated = function(cb){
  this.config.isAuthenticated = cb;
};

module.exports = UserIdentity;
