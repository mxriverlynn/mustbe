var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("custom failure response", function(){

  describe("when not authenticated and custom failure method is provided", function(){
    var async = new AsyncSpec(this);

    var response, req, res, next;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getNullUser);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });
      });

      function failure(req, res, next){
        res.redirect(301, "http://google.com");
      }

      function authCheck(handler){
        var routeHelpers = mustBe.routeHelpers();
        return routeHelpers.authenticated(handler, failure);
      }

      var request = helpers.setupRoute("/", mustBe, authCheck);

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should use the custom response", function(){
      helpers.expectRedirect(response, 301, "http://google.com");
    });

  });

  describe("when not authorized and custom failure method is provided", function(){
    var async = new AsyncSpec(this);

    var response, req, res, next;

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

      function failure(req, res, next){
        res.redirect(301, "http://google.com");
      }

      function authCheck(handler){
        var routeHelpers = mustBe.routeHelpers();
        return routeHelpers.authorized("do thing", handler, failure);
      }

      var request = helpers.setupRoute("/", mustBe, authCheck);

      request(function(err, res){
        response = res;
        done();
      });
    });

    it("should use the custom response", function(){
      helpers.expectRedirect(response, 301, "http://google.com");
    });

  });

});
