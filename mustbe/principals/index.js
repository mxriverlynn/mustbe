
// Principal
// -------------

function Principal(identity, verifier){
  this.identity = identity;
  this.verifier = verifier;
}

Principal.prototype.isAuthenticated = function(cb){
  this.identity.isAuthenticated(cb);
};

Principal.prototype.isAuthorized = function(activity, requestParams, cb){
  this.verifier.isAuthorized(activity, requestParams, cb);
};

module.exports = Principal;
