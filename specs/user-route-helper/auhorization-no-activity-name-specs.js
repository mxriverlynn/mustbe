var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("no activity name", function(){

  describe("when authorizing with no activity name, and not explicitly allowed or denied", function(){
    var response;

    beforeEach(function(done){
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
        return routeHelpers.authorized(handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should not allow request", function(){
      var errorMessage = "Activity Not Found, undefined";
      var errorType = "ActivityNotFoundException";
      helpers.expectResponseError(response, errorMessage, errorType);
    });

  });

  describe("when authorizing with no activity name, and explicitly denied", function(){
    var response;

    beforeEach(function(done){
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
          activities.deny(function(user, activity, cb){
            cb(null, true);
          });
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized(handler);
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

  describe("when authorizing with no activity name, but explicitly allowed", function(){
    var response;

    beforeEach(function(done){
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
          activities.allow(function(user, activity, cb){
            cb(null, true);
          });
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized(handler);
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

});
