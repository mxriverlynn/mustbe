function RequestUserPrincipal(req, config){
  this.req = req;
  this.config = config;
}

RequestUserPrincipal.prototype.isAuthenticated = function(cb){
  this.config.getUser(this.req, function(err, user){
    if (err) { return cb(err); }
    this.config.isAuthenticated(user, cb);
  });
};

module.exports = RequestUserPrincipal;
