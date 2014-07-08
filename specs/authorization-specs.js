var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("authorization", function(){

  describe("when doing authorization check", function(){
    var async = new AsyncSpec(this);

    var response, user;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);

        config.activities(function(activities){
          activities.can("do thing", function(u, params, cb){
            user = u;
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

    it("should pass the user to the validator", function(){
      expect(user).toBe(helpers.user);
    });
  });

  describe("when an authorized route has params that are mapped", function(){
    var async = new AsyncSpec(this);

    var params, response, req;

    async.beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.getUser(helpers.getValidUser);
        config.isAuthenticated(helpers.isAuthenticated);

        config.activities(function(activities){
          activities.can("do thing", function(user, p, cb){
            params = p;
            cb(null, true);
          });
        });

        config.parameterMaps(function(params){

          params.map("do thing", function(req){
            return {
              foo: req.params["foo"]
            }
          });

        });
      });

      var request = helpers.setupRoute("/:foo", mustBe, function(handler){
        return mustBe.authorized("do thing", handler);
      });

      request("/bar", function(res){
        response = res;
        done();
      });
    });

    it("should pass the params to the authorization check", function(){
      expect(params.foo).toBe("bar");
    });
  });

});
