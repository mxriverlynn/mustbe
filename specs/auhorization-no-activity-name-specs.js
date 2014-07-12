var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("no activity name", function(){

  describe("when authorizing with no activity name, and not explicitly allowed or denied", function(){
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
        return mustBe.authorized(handler);
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

  describe("when authorizing with no activity name, and explicitly denied", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);

        config.activities(function(activities){
          activities.allow(function(user, activity, cb){
            cb(null, false);
          });
        });
      });

      var request = helpers.setupRoute("/", mustBe, function(handler){
        return mustBe.authorized(handler);
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

  describe("when authorizing with no activity name, but explicitly allowed", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);

        config.activities(function(activities){
          activities.allow(function(user, activity, cb){
            cb(null, true);
          });
        });
      });

      var request = helpers.setupRoute("/", mustBe, function(handler){
        return mustBe.authorized(handler);
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

});
