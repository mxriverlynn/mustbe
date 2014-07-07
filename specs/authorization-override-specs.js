var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("authorization overrides", function(){

  describe("when an activity is explicitly denied", function(){
    var async = new AsyncSpec(this);

    var response, user;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);

        config.activities(function(activities){

          activities.deny(function(user, activity, cb){
            cb(null, true);
          });

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

    it("should not allow the request", function(){
      helpers.expectResponseCode(response, 403);
    });

  });

  describe("when an activity is explicitly allowed", function(){
    var async = new AsyncSpec(this);

    var response, user;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);

        config.activities(function(activities){
          activities.allow(function(user, activity, cb){
            cb(null, true);
          });
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

    it("should allow the request", function(){
      helpers.expectResponseCode(response, 200);
    });

  });

  describe("when an activity is explicitly denied and allowed", function(){
    var async = new AsyncSpec(this);

    var response, user;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);

        config.activities(function(activities){
          activities.deny(function(user, activity, cb){
            cb(null, true);
          });

          activities.allow(function(user, activity, cb){
            cb(null, true);
          });
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

    it("should not allow the request", function(){
      helpers.expectResponseCode(response, 403);
    });
  });

  describe("when an activity is neither explicitly denied nor explicitly allowed, but is authorized", function(){
    var async = new AsyncSpec(this);

    var response, user;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);

        config.activities(function(activities){
          activities.deny(function(user, activity, cb){
            cb(null, false);
          });

          activities.allow(function(user, activity, cb){
            cb(null, false);
          });

          activities.can("do thing", function(user, params, cb){
            cb(null, true);
          });
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

    it("should allow the request", function(){
      helpers.expectResponseCode(response, 200);
    });
  });

  describe("when an activity is neither explicitly denied nor explicitly allowed, and not authorized", function(){
    var async = new AsyncSpec(this);

    var response, user;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthorized(helpers.notAuthorized);

        config.activities(function(activities){
          activities.deny(function(user, activity, cb){
            cb(null, false);
          });

          activities.allow(function(user, activity, cb){
            cb(null, false);
          });

          activities.can("do thing", function(user, params, cb){
            cb(null, false);
          });
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

    it("should not allow the request", function(){
      helpers.expectResponseCode(response, 403);
    });
  });

});
