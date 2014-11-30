## Authorizing Express Routes

Once you have MustBe configured, you can use it to authorize
Express routes. Doing this allows you to determine who can
take what actions in your application, based on the configued
activities within your system. 

Please see the [configuration documentation](./configure.md)
for information on configuring the activities and user.

Start by requiring `mustbe` and grabbing the `routeHelpers()`
from this module. 

### Require Authentication For A Route

You can apply a requirement to be authenticated - that is, 
logged in - using the `authenticated` method. 

```js
var mustbe = require("mustbe").routeHelpers();
var express = require("express");

var router = express.Router();
router.get("/profile", mustBe.authenticated(viewProfile));

function viewProfile(req, res, next){
  res.render("/profile/view");
}
```

You should note that MustBe does not provide support for
authentication, directly. The means by which you assert someone
is authenticated is entirely up to you. MustBe does, however,
allow you to check authentication. This is done through the
use of [the `isAuthenticated` configuration method](./configure.md).


### Require Authorization For An Activity

The most basic authorization of an activity is done with the
`mustBe.authorized` method call. This method assumes a user
is in need of the authorization.

```js
var mustbe = require("mustbe").routeHelpers();
var express = require("express");

var router = express.Router();
router.get("/:id", mustBe.authorized("view thing", view));

function view(req, res, next){
  res.render("/something");
}
```

In this example, a "view thing" activity is required to view
the thing in question.

The first parameter of the `authorized` call is the activity
name, and the second is the route handler method to call if
the user is authorized.

The route handler method receives all of the standard Express
route handler parameters.

### Custom Failure Handler

The default method for handling failed authorization and 
authentication checks are set up through [the `routeHelpers`
configuration methods](./configure.md). However, there will
be times when you need a specific view or other action to be
taken when an authorization or authentication check fails.

To handle this situation, you may provide an additional
parameter to the `authenticated` and `authorized` methods of
the routeHelpers. This extra parameter is a route handler
callback function, accepting all of the standard parameters of
an Express route handler.

```js
var mustbe = require("mustbe").routeHelpers();
var express = require("express");

var router = express.Router();
router.get("/:id", mustBe.authorized("view thing", view, cannotView));

function view(req, res, next){
  res.render("/something");
}

funciton cannotView(req, res, next){
  res.render("/cannot-view");
}
```

In this example, an authorization check that passes will call
the `view` route handler and render the "something" view. If
the authorization check fails, the `cannotView` handler will
be called and will render the "cannot-view" view. 

The same extra parameter also applies to the `authenticated`
method of the routeHelpers.
