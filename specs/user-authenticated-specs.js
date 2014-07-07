var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("user authenticated", function(){

  describe("when user is found", function(){
    var async = new AsyncSpec(this);

    var user = {};
    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);
      });

      var request = helpers.setup(mustBe, function(handler){
        return mustBe.authenticated(handler);
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

  describe("when user is not found", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(function(req, cb){
          cb(null, undefined);
        });
        config.isAuthenticated(function(user, cb){
          cb(null, !!user);
        });
        config.notAuthenticated(function(req, res){
          res.send(403, {});
        });
      });

      var request = helpers.setup(mustBe, function(handler){
        return mustBe.authenticated(handler);
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

  describe("when getting user causes error", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(function(req, cb){
          var err = new Error("some error");
          cb(err);
        });
      });

      var request = helpers.setup(mustBe, function(handler){
        return mustBe.authenticated(handler);
      });

      request(function(res){
        response = res;
        done();
      });
    });

    it("should throw the error", function(){
      helpers.expectResponseError(response, "some error");
    });

  });

});
