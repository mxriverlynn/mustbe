var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("custom identity authorization check", function(){

  describe("when requesting authorization for a custom identity", function(){
    var identityType = "my-identity";

    describe("and that identity is allowed to do the activity", function(){
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
          return routeHelpers.authorizeIdentity(identityType, "do thing", handler);
        });

        request(function(res){
          response = res;
          done();
        });
      });

      it("should authorize the activity", function(){
        helpers.expectResponseCode(response, 200);
      });
    });

    describe("and that identity is not allowed to do the activity", function(){
      var async = new AsyncSpec(this);
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
          return routeHelpers.authorizeIdentity(identityType, "do thing", handler);
        });

        request(function(res){
          response = res;
          done();
        });
      });

      it("should authorize the activity", function(){
        helpers.expectResponseCode(response, 403);
      });
    });

  });

});
