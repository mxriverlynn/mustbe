var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("invalid identity authorization check", function(){

  describe("when requesting authorization for a custom identity that does not exist", function(){
    var identityType = "my-identity";
    var nonExistentType = "non-existent";
    var async = new AsyncSpec(this);
    var mustBe, err, response;

    async.beforeEach(function(done){
      mustBe = new MustBe();

      mustBe.configure(function(config){
      });

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

    it("should not authorize the activity", function(){
      throw new Error("not implemented yet");
    });
  });
});

