var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

xdescribe("identity", function(){

  describe("when getting identity and not providing an identity type to get", function(){
    var id;

    beforeEach(function(){
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.userIdentity(function(id){
          id.isAuthenticated(function(){});
        });
      });

      id = mustBe.getIdentity();
    });

    it("should return the default identity", function(){
      expect(id).not.toBe(null);
    });

  });

  describe("when getting a custom identity by type", function(){
    var Identity, IdentityType, id;

    beforeEach(function(){
      IdentityType = "cust.id";
      Identity = function(){
        this.type=IdentityType;
        this.isAuthenticated = function(){};
      };
      var mustBe = new MustBe();

      mustBe.configure(function(config){
        config.addIdentity(IdentityType, Identity);
      });

      id = mustBe.getIdentity(IdentityType);
    });

    it("should return the custom identity", function(){
      expect(id.type).toBe(IdentityType);
    });
  });

  xdescribe("when userIdentity is configured with an isAuthenticated method", function(){

    it("should return whether or not the user is authenticated", function(){
      throw new Error("not implemented");
    });

  });

});
