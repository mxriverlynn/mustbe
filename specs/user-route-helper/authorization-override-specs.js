var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("authorization overrides", function(){

  describe("when an activity is explicitly denied", function(){
    var async = new AsyncSpec(this);

    var response, user;

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
          activities.deny(function(user, activity, cb){
            cb(null, true);
          });
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
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
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
        return routeHelpers.authorized("do thing", handler);
      });

      request(function(err, res){
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

          activities.allow(function(user, activity, cb){
            cb(null, true);
          });
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
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });

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

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized("do thing", handler);
      });

      request(function(err, res){
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
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
          rh.notAuthorized(helpers.notAuthorized);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });

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

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authorized("do thing", handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should not allow the request", function(){
      helpers.expectResponseCode(response, 403);
    });
  });

});
