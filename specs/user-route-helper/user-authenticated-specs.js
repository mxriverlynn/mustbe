var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("user authenticated", function(){

  describe("when user is found", function(){
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
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authenticated(handler);
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

  describe("when user is not found", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getNullUser);
          rh.notAuthenticated(helpers.notAuthenticated);
        });
        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authenticated(handler);
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

  describe("when getting user causes error", function(){
    var async = new AsyncSpec(this);

    var response;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(function(req, cb){
            var err = new Error("some error");
            cb(err);
          });
        });
      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/", mustBe, function(handler){
        return routeHelpers.authenticated(handler);
      });

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should throw the error", function(){
      helpers.expectResponseError(response, "some error");
    });

  });

});
