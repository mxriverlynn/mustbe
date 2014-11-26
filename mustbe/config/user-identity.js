function UserIdentity(){
  this.validators = {};
}

UserIdentity.prototype.isAuthenticated = function(cb){
  this.isAuthenticated = cb;
};

module.exports = UserIdentity;
