var AsyncSpec = require("jasmine-async")(jasmine);
var MustBe = require("../../mustbe/core");
var helpers = require("../helpers");

xdescribe("generic principal / identity authorization check", function(){

  describe("when requesting authorization for a named principal / identity", function(){
    var principalName = "some.principal";

    describe("and that principal is allowed to do the activity", function(){
      var isAuthorized;

      var async = new AsyncSpec(this);

      async.beforeEach(function(done){
        var mustBe = new MustBe();

        mustBe.configure(function(config){

          config.routeHelpers(function(rh){
            rh.isAuthorized(helpers.isAuthorized);
          });

          config.activities(principalName, function(activities){
            activities.can("do thing", helpers.authorizedValidation);
          });
        });

        var routeHelpers = mustBe.routeHelpers();
        var principal = mustBe.getPrincipal(principalName);
        var request = helpers.setupRoute("/", mustBe, function(handler){
          return routeHelpers.authorizePrincipal(principal, "do thing", handler);
        });

        request(function(res){
          response = res;
          done();
        });
      });

      it("should authorize the activity", function(){
        expect(isAuthorized).toBe(true);
      });

    });

  });

});
