function RouteHelpers(){
  this.validators = {};
}

RouteHelpers.prototype.getUser = function(cb){
  this.getUser = cb;
};

RouteHelpers.prototype.notAuthenticated = function(cb){
  this.notAuthenticated = cb;
};

RouteHelpers.prototype.notAuthorized = function(cb){
  this.notAuthorized = cb;
};

module.exports = RouteHelpers;
