# mustBe

**Authorization plumbing for ExpressJS/Connect apps.**

mustBe is not a complete authorization framework, with roles
and responsibilities and models and data access and everything
that you need. Rather, it is the underlying plumbing that you
need to secure your site. It allows you to fill in the 
necessary parts to manage data access, roles and users, and
gives you the activity based plumbing to secure it all. 

## Authorization, Not Authentication

mustBe is an authorization system - the part of a security system
that decides whether or not you are allowed to do something. This
is the second of authentication and authorization, where authentication
simply determines who you are. 

Specifically, mustBe is an activity based authorization system. It
allows you to verify that a user has permissions to perform any
given activity in your application.

## What Is Activity Based Authorization?

The gist of it is that you check whether or not a user
has permission to perform an activity. How they get permission
to do that activity is up to you. Maybe it's throug a role,
maybe it's through data they have been assigned to. But the
permission for the activity is what needs to be checked.

For more detail on this, check out 
[my 2011 article on using activity based authorization checks](http://lostechies.com/derickbailey/2011/05/24/dont-do-role-based-authorization-checks-do-activity-based-checks/). 
It will give you the core of what you need to know about
whey role-based authorization checks are a bad idea, and why
activity based permissions are the way to go. 

## Install

`npm install --save mustbe`

## How To Use It

In your app.js (or whatever bootstraps your app), require
the mustBe module, and also bring in a mustbe-config module
which you will define in a moment. 

Call the `.config` method
on the `mustBe` object, and pass in the function that is
exported from the config module.

```js
// app.js

var mustBe = require("mustbe");
var mustBeConfig = require("./mustbe-config");
mustBe.configure(mustBeConfig);
```

Now you can create a `mustbe-config.js` file for your application.
Having the config file separate from the `app.js` bootstrapper
file helps to keep things clean.

Open the `mustbe-config.js` file and build your configuration.
Provide configuration for your user identity, route helpers, 
activities and/or overrides.

Here is a complete configuration example from which you can start:

```js
// mustbe-config.js

var mustBe = require("mustbe");

module.exports = function(config){

  // route helper configuration
  // --------------------------

  config.routeHelpers(function(rh){

    // get the current user from the request object
    rh.getUser(function(req, cb){
      cb(null, req.user);
    });

    // what do we do when the user is not authenticated?
    rh.notAuthenticated(function(req, res, next){
      res.redirect("/login?msg=you are not logged in");
    });

    // what do we do when the user is not authorized?
    rh.notAuthorized(function(req, res, next){
      res.redirect("/login?msg=you are not authorized");
    });

    // parameter map -> activity params
    // ---------------------------------

    rh.parameterMaps(function(params){

      // the activity being checked is the first param
      // 
      // the 2nd param maps a request object to the params
      // that get passed in to the activity
      // authorization function
      params.map("view thing", function(req){
        return {
          id: req.params["id"]
        };
      });

      params.map("edit thing", function(req){
        return {
          id: req.params["id"]
        };
      });

    });

  });

  // user identity configuration
  // ---------------------------

  config.userIdentity(function(id){

    // determine if this user is authenticated or not
    id.isAuthenticated(function(user, cb){
      var isAuthenticated = !!user;
      cb(null, isAuthenticated);
    });

  });

  // activity configuration
  // -----------------------

  config.activities(function(activities){
    // 1) check if explicitly denied
    // 2) if not explicitly denied, then check explicit allowance
    // 3) if not explicitly allowed, then check authorization

    // explicitly deny anonymous users
    activities.deny(function(user, activity, cb){
      var isAnonymous = (!!user);
      var isDenied = isAnonymous;
      cb(null, isDenied);
    });

    // explicitly allow admin users
    activities.allow(function(user, activity, cb){
      var isAdmin = (_.indexOf(user.roles, "admin") >= 0);
      var isAllowed = isAdmin;
      cb(null, isAllowed);
    });

    // configure an activity with an authorization check
    activities.can("view thing", authorizeViewThing);
    activities.can("edit thing", authorizeEditThing);
  });

  // an authorization check
  function authorizeViewThing(user, params, cb){
    var id = params["id"];

    // do some check to see if the user can
    // view the thing in question
    user.anotherThing(id, function(err, thing){
      var hasThing = !!thing;
      cb(err, hasThing);
    });
  }

  // an authorization check
  function authorizeEditThing(user, params, cb){
    var id = params["id"];

    // do some check to see if the user can
    // edit the thing in question
    user.someThing(id, function(err, thing){
      var hasThing = !!thing;
      cb(err, hasThing);
    });
  }

};
```

Now you can run the `mustBe` functions on your routes.

```js
var mustbe = require("mustbe").routeHelpers();
var express = require("express");
var router = express.Router();

router.get("/", index);
router.get("/profile", mustBe.authenticated(showProfile));
router.get("/:id", mustBe.authorized("view thing", view, cannotView));
router.get("/:id/edit", mustBe.authorized("edit thing", edit));

function index(req, res, next) {
  res.render("index", { title: "Express" });
}

function showProfile(req, res, next){
  res.render("/user/profile", {
    user: req.user
  });
}

function edit(req, res, next){
  // ...
}

function view(req, res, next){
  // this method fires when the "view thing"
  // authorization succeeds, allowing the
  // user to view the thing

  res.render("/something");
}

function cannotView(req, res, next){
  // this method fires when the "view thing"
  // authorization fails
  res.status(404);
  res.send({});
}

module.exports = router;
```

## Custom Identities

The default use case for mustBe assumes a user that is logged in. However, it can
be used with a custome `Identity` type, to check authorization rules against
any identity desired.

Custom Identity must conform to the following protocol:

* Constructor function receiving a `config` argument

The object instance returned from the constructor function must implement
the following protocol:

* a `type` attribute as a string, identifying the identity type
* a `isAuthenticated` method, receiving a callback

The callback for the `isAuthenticated` method recieves an optional `Error` 
object as the first parameter, and a boolean value as the second parameter to
determine whether or not the Identity is authorized.

### Example Custom Identity

The following is a very basic example of a custom Identity:

```js
var MyIdentity = function(config){
  this.type = identityType;
  this.config = config;
  this.isAuthenticated = function(cb){
    cb(true);
  };
};
```

Once defined, the Identity's constructor function can be registered with the
`config.addIdentity` method. This method takes in a string as the Identity
type name, and the Identity constructor function as a second parameter.

After registering it, you can add activities for the identity by
passing in an identitype type to the `config.activities` method.

```js
module.exports = function(config){
  // ...
  
  config.addIdentity("my-identity", MyIdentity);
  
  config.activities("my-identity", function(activities){
    activities.can("do-something", function(user, params, cb){
      // determine if user can do something or not
      // hard code that they can do it, as an example
      cb(null, true);
    });
  });
};
```

## Legal Junk

Copyright 2014 Muted Solutions, LLC. All Rights Reserved.

Distributed under [MIT License](http://mutedsolutions.mit-license.org).
