var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("user authenticated", function(){

  describe("when user is found", function(){
    var async = new AsyncSpec(this);
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
        config.getUser(helpers.getNullUser);
        config.isAuthenticated(helpers.isAuthenticated);
        config.notAuthenticated(helpers.notAuthenticated);
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
