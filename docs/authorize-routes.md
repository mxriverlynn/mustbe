## Authorizing Express Routes

```js
var mustbe = require("mustbe").routeHelpers();
var express = require("express");

var router = express.Router();
router.get("/:id", mustBe.authorized("view thing", view));

function view(req, res, next){
  res.render("/something");
}
```
