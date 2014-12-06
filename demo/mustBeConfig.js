var User = require("./lib/user");

module.exports = function(config){

  config.routeHelpers(function(rh){
    rh.getUser(function(req, cb){

      // this may involve database code or other
      // things... in this case, a user object
      var userCookie = req.cookies["usercookie"];
      User.loginFromCookie(userCookie, function(err, user){
        cb(null, user);
      });
    });

    rh.notAuthorized(function(req, res, next){
      res.redirect("/?alert=you are not authorized!");
    });

    rh.notAuthenticated(function(req, res, next){
      res.redirect("/?alert=you must log in first!");
    });
  });

  config.userIdentity(function(id){
    id.isAuthenticated(function(user, cb){

      // you may have real logic here to check if someone
      // is logged in or not. maybe this hits a database
      // or does something else...
      var isAuthenticated = !!user;
      return cb(null, isAuthenticated);

    });
  });

  config.activities(function(activities){

    activities.can("view.profile", function(identity, params, cb){
      // anyone can view the profile, if they are logged in
      var user = identity.user;
      if (user) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    });

    activities.can("admin", function(identity, params, cb){
      // have to be logged in before i check if you're an admin
      var user = identity.user;
      if (!user) {
        return cb(null, false); 
      }

      // now check if you're an admin. this may involve database
      // calls or other service calls.
      var isAdmin = (user.roles.indexOf("admin") > -1);
      cb(null, isAdmin);
    });
  });

};
