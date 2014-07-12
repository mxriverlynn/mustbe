var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("authorization", function(){

  describe("when user is authorized", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);

        config.activities(function(activities){
          activities.can("do thing", helpers.authorizedValidation);
        });
      });

      var request = helpers.setupRoute("/", mustBe, function(handler){
        return mustBe.authorized("do thing", handler);
      });

      request(function(res){
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
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);

        config.activities(function(activities){
          activities.can("do thing", helpers.unauthorizedValidation);
        });
      });

      var request = helpers.setupRoute("/", mustBe, function(handler){
        return mustBe.authorized("do thing", handler);
      });

      request(function(res){
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
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);
      });

      var request = helpers.setupRoute("/", mustBe, function(handler){
        return mustBe.authorized("do thing", handler);
      });

      request(function(res){
        response = res;
        done();
      });
    });

    it("should not allow request", function(){
      helpers.expectResponseCode(response, 403);
    });

  });
});
