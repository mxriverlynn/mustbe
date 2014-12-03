## Using As Express Middleware

MustBe can easily be used as middleware to provide authorization
for an entire tree of routes, or as a global middleware to
ensure authorization or authentication. This is useful in many
scenarios:

* Requiring administration rights for the `/admin/*` routes
* Requiring authentication for the `/profile/*` routes
* Etc.

The basics of doing this is the same as what you saw in
the [route authorization documentation](authorize-routes.md).
The authorization checks are being applied at a higher level,
instead of at an individual route in this case.

**Note:** As with most middleware, be sure to set these up
before your routes are set up. Otherwise, you won't get the
desired effect.

### Require Admin Rights For `/admin/*` Routes

Say you have a `/admin` route on your site, and a few dozen
sub-routes underneath of that. If you want to require authorization
for the entire folder, but you don't want to copy & paste the
same authorization code on to all of the individual routes,
you can do that using MustBe as middleware.

Set up an activity, such as "admin.view" in your
[MustBe configuration](./configure.md), and then `use` the
[routeHelper for authorization](./authorize-routes.md) as
middlware in the Express App.

```js
var mustBe = require("mustbe").routeHelpers();

app.use("/admin", mustBe.authorized("admin.view", function(req, res, next){
  // this callback fires if the current user
  // is authorized for the "admin.view" activity.
  // since it is middleware, we must call `next` to ensure
  // the route processing continues

  next();
});
```

Note that you only have to call `next()` in this middleware
callback. That will send people on to the actual route handler
for the request.

### Require Authenticated Users for `/profile` Routes

Similar to the admin routes above, you can apply a requirement
to be authenticated - that is, logged in - using MustBe. Rather
than using the `authorized` method, you would replace that with
the `authenticated` method.

```js
var mustBe = require("mustbe").routeHelpers();

app.use("/profile", mustBe.authenticated(function(req, res, next){
  // this callback fires if the current user
  // is authenticated. since it is middleware, 
  // we must call `next` to ensure
  // the route processing continues

  next();
});
```

You should note that MustBe does not provide support for
authentication, directly. The means by which you assert someone
is authenticated is entirely up to you. MustBe does, however,
allow you to check authentication. This is done through the
use of [the `isAuthenticated` configuration method](./configure.md).

