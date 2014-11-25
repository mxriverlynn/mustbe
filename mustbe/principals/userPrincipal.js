var Verifier = require("../verifier");

// UserPrincipal
// -------------

function UserPrincipal(userIdentity, config){
  this.identity = userIdentity;
  this.verifier = new Verifier(this.identity, config);
}

UserPrincipal.prototype.isAuthenticated = function(cb){
  this.identity.isAuthenticated(cb);
};

UserPrincipal.prototype.isAuthorized = function(activity, requestParams, cb){
  this.verifier.isAuthorized(activity, requestParams, cb);
};

module.exports = UserPrincipal;
