var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("authorization", function(){

  describe("when user is authorized", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });

        config.activities(function(activities){
          activities.can("do thing", helpers.authorizedValidation);
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized("do thing", handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should allow request", function(){
      helpers.expectResponseCode(response, 200);
    });

  });

  describe("when user is not authorized", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
          rh.notAuthorized(helpers.notAuthorized);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });

        config.activities(function(activities){
          activities.can("do thing", helpers.unauthorizedValidation);
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized("do thing", handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should not allow request", function(){
      helpers.expectResponseCode(response, 403);
    });

  });

  describe("when there is no authorization check for an activity", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
          rh.notAuthorized(helpers.notAuthorized);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized("do thing", handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should throw an activity not found error", function(){
      var errorMessage = "Activity Not Found, do thing";
      var errorType = "ActivityNotFoundException";
      helpers.expectResponseError(response, errorMessage, errorType);
    });

  });
});
