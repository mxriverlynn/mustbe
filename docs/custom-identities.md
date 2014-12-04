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
object as the first parameter, and a Boolean value as the second parameter to
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
passing in an identity type to the `config.activities` method.

```js
module.exports = function(config){
  // ...
  
  config.addIdentity("my-identity", MyIdentity);
  
  config.activities("my-identity", function(activities){
    activities.can("do-something", function(identity, params, cb){
      // determine if the identity can do something or not
      // hard code that they can do it, as an example
      cb(null, true);
    });
  });
};
```
