# mustBe

Authorization framework for ExpressJS/Connect apps.

## Install

`npm install --save mustbe`

## How To Use It

First you need to configure it

```js
// configure mustBe

var mustBe = require("mustbe");

mustBe.configure(function(config){

  // core configuration
  // ------------------

  config.getUser(function(req, cb){
    cb(null, req.user);
  });

  config.isAuthenticated(function(user, cb){
    cb(null, !!user);
  });

  // what do we do when the user is not authenticated?
  config.notAuthenticated(function(req, res){
    res.redirect("/login?msg=you are not logged in");
  });

  // what do we do when the user is not authorized?
  config.notAuthorized(function(req, res){
    res.redirect("/login?msg=you are not authorized");
  });

  // activitiy configuration
  // -----------------------

  config.activities(function(activities){
    // 1) check if explicitly denied
    // 2) if not explicitly denied, then check explicit allowance
    // 3) if not explicitly allowed, then check authorization

    // explicitly deny anonymous users
    activities.deny(function(user, activity){
      var isAnonymous = (!!user);
      return isAnonymous;
    });

    // explicitly allow admin users
    activities.allow(function(user, activity){
      var isAdmin = (_.indexOf(user.roles, "admin") >= 0);
      return isAdmin;
    });

    // configure an activity with an authorization check
    activities.can("view thing", authorizeViewThing);
    activities.can("edit thing", authorizeEditThing);
  });

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

  // route -> activity map
  // ---------------------

  config.routes(function(routes){

    routes.map({
      // the activity to authorize
      activity: "view thing",

      // map a request parameters to the params
      // that get passed in to the activity
      // authorization function
      getParams: function(req){
        return {
          id: req["id"]
        }
      }
    });

    routes.map({
      activity: "edit thing",
      getParams: function(req){
        return {
          id: req["id"]
        }
      }
    });
  });

});
```

Then you can run the `mustBe` functions on your routes.

```js
var mustbe = require("mustbe");
var express = require("express");
var router = express.Router();

router.get("/", index);
router.get("/profile", mustBe.authenticated(showProfile));
router.get("/:id", mustBe.authorized("view thing", view));
router.get("/:id/edit", mustBe.authorized("edit thing", edit));

function index(req, res) {
  res.render("index", { title: "Express" });
}

function showProfile(req, res){
  res.render("/user/profile", {
    user: req.user
  });
}

function view(req, res){
  // ...
}

function edit(req, res){
  // ...
}

module.exports = router;
```

## Legal Junk

Copyright 2014 Muted Solutions, LLC. All Rights Reserved.

Distributed under [MIT License](http://mutedsolutions.mit-license.org).
