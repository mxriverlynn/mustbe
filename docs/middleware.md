## Using As Express Middleware

MustBe can easily be used as middleware to provide authorization
for an entire tree of routes, or as a global middlware to
ensure authorization or authentication. This is useful in many
scenarios:

* Requiring administration rights for the `/admin/*` routes
* Requiring authentication for the `/profile/*` routes
* Disallowing anonyous users on a website, entirely

The basics of doing this is the same as what you saw in
the [route authorization documentation](authorize-routes.md).
The authorization checks are being applied at a higher level,
instead of at an individual route in this case.

### Require Admin Rights For `/admin/*` Routes

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
