var MustBe = require("../mustbe/core");
var helpers = require("./helpers");

describe("identity", function(){

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

});
