var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("invalid identity authorization check", function(){

  describe("when requesting authorization for a custom identity that does not exist", function(){
    var identityType = "my-identity";
    var nonExistentType = "i don't exist";
    var async = new AsyncSpec(this);
    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        var MyIdentity = function(config){
          this.type = identityType;
          this.config = config;
          this.isAuthenticated = function(cb){
            cb(true);
          };
        };

        config.addIdentity(identityType, MyIdentity);

        config.activities(identityType, function(activities){
          activities.can("do thing", helpers.authorizedValidation);
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorizeIdentity(nonExistentType, "do thing", handler);
      });

      request(function(res){
        response = res;
        done();
      });
    });

    it("should throw an 'identity not found' exception", function(){
      throw new Error("not implemented yet");
    });
  });
});

