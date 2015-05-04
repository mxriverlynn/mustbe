## Core Configuration

MustBe has a core set of configuration options, through the
use of it's `mustBe.configure` method call. This method takes
a callback function that receives a `config` object. The `config`
object contains various methods to configure the identities,
authorization rules and other aspects of the MustBe framework.

```js
// ./mustBeConfig.js
module.exports = function(config){

  // config.* method calls

};
```

### config.userIdentity

The default identity used for authorization checks is the `userIdentity`. This
identity can be configured through the `config.userIdentity` method.

```js
config.userIdentity(function(id){

  // determine if this user is authenticated or not
  id.isAuthenticated(function(user, cb){
    // note that the "user" in this case, is the user
    // that was supplied by the routeHelpers.getUser function
    var isAuthenticated = false;
    if (user) {
      isAuthenticated = user.isLoggedIn();
    }
    cb(null, isAuthenticated);
  });

});
```

### config.routeHelpers

Authorization checks are done through the use of route helpers. Route helpers
are used to map route parameters, to load user objects from the current
request (if applicable), to provide default handling of failed authentication
and authorization, etc.

```js
config.routeHelpers(function(rh){

  // get user object that is stored on the request
  rh.getUser(function(req, cb){
    cb(null, req.user);
  });

  // default action to take when authorization fails
  rh.notAuthorized(function(req, res, next){
    res.redirect("/login");
  });

  // default action to take when user is not authenticated
  rh.notAuthenticated(function(req, res, next){
    res.redirect("/login");
  });

  // map request parameters to authorization checks, for activities
  rh.parameterMaps(function(params){
    // map params to the "do.something" activity
    params.map("do.something", function(req){
      return {
        fooId: req.params.fooId,
        bar: req.query.bar
      }
    });
  });

});
```

### config.activities

Activities are the work units that need to be authorized. Think of
verbs and actions taken against things in the system. For 
example, creating users or updating employees. You could have
activities like "user.create" and "employee.update" - but these
are strings, so you can name them whatever you like.

Use activity configuration to determine who can and cannot
perform the activity.

```js
config.activities(function(activities){

  // provide a global "allow" override for special users.
  // alternatively, use the "activity" param to run logic
  // against who can / cannot access that activity
  activities.allow(function(identity, activity, cb){
    var user = identity.user; 
    var allow = false;
    if (user.isInRole("admin")){
      allow = true;
    }
    cb(null, allow);
  });

  // provide a global "deny" override for people that should
  // never be able to do anything.
  // alternatively, use the "activity" param to run logic
  // against who can / cannot access that activity
  activities.deny(function(identity, activity, cb){
    var user = identity.user; 
    var deny = false;
    if (user.isAnonymous()){
      deny = true;
    }
    cb(null, deny);
  });

  // authorize an individual activity, using a more complete
  // set of logic, with good separation of concerns for each rule
  // the params are mapped from the parameterMaps in 
  // the routeHelpers
  activities.can("do.something", function(identity, params, cb){
    var user = identity.user;
    someLibrary.checThings(user, function(err, result){
      if (err) { return cb(err); }
      
      var allow = false;
      if (result.foo){
        allow = true;
      }

      cb(null, allow);
    });
  });

});
```

### config.addIdentity

While the default mode of authorization relies on a logged in
user, you can create a custom Identity type to handle the
authorization of non-user entities. 

The ability to add an identity, through the `config.addIdentity`
method is covered [the Custom Identity documentation](./custom-identities.md)
