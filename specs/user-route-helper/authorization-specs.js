var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

describe("authorization", function(){

  describe("when doing authorization check", function(){
    var response, userIdentity;

    beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });

        config.activities(function(activities){
          activities.can("do thing", function(u, params, cb){
            userIdentity = u;
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

    it("should pass the user to the validator", function(){
      expect(userIdentity.user).toBe(helpers.user);
    });
  });

  describe("when an authorized route has params that are mapped", function(){
    var params, response, req;

    beforeEach(function(done){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.routeHelpers(function(rh){
          rh.getUser(helpers.getValidUser);

          rh.parameterMaps(function(params){
            params.map("do thing", function(req){
              return {
                foo: req.params["foo"]
              }
            });
          });
        });

        config.userIdentity(function(id){
          id.isAuthenticated(helpers.isAuthenticated);
        });

        config.activities(function(activities){
          activities.can("do thing", function(user, p, cb){
            params = p;
            cb(null, true);
          });
        });

      });

      var routeHelpers = mustBe.routeHelpers();
      var request = helpers.setupRoute("/:foo", mustBe, function(handler){
        return routeHelpers.authorized("do thing", handler);
      });

      request("/bar", function(err, res){
        response = res;
        done();
      });
    });

    it("should pass the params to the authorization check", function(){
      expect(params.foo).toBe("bar");
    });
  });

});
