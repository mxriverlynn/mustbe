var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("invalid identity authorization check", function(){
  var identityType = "my-identity";

  describe("when requesting authorization for a custom identity that does not exist", function(){
    var nonExistentType = "non-existent";
    var async = new AsyncSpec(this);
    var mustBe, err, response;

    async.beforeEach(function(done){
      mustBe = new MustBe();

      mustBe.configure(function(config){});

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorizeIdentity(nonExistentType, "do thing", handler);
      });

      request(function(e, res){
        response = res;
        done();
      });
    });

    it("should throw an 'identity not found' exception", function(){
      var errorMessage = "Identity Not Found, " + nonExistentType;
      var errorType = "IdentityNotFoundException";
      helpers.expectResponseError(response, errorMessage, errorType);
    });
  });

  describe("when requesting authorization for an activity that does not exist on a custom identity", function(){
    var async = new AsyncSpec(this);
    var nonExistentActivity = "non-existent";
    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        var MyIdentity = function(config){
          this.type = identityType;
          this.config = config;
          this.isAuthenticated = function(cb){
            cb(null, true);
          };
        };

        config.routeHelpers(function(rh){
          rh.notAuthorized(helpers.notAuthorized);
        });

        config.addIdentity(identityType, MyIdentity);

        config.activities(identityType, function(activities){
          activities.can("do thing", helpers.unauthorizedValidation);
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorizeIdentity(identityType, nonExistentActivity, handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should not authorize the activity", function(){
      var errorMessage = "Activity Not Found, " + nonExistentActivity;
      var errorType = "ActivityNotFoundException";
      helpers.expectResponseError(response, errorMessage, errorType);
    });
  });
});
