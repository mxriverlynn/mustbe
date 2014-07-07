var express = require("express");
var supertest = require("supertest");

var user = {};

var helpers = {
  user: user,

  setup: function(mustBe, cb){
    var app = new express();
    mustBe.use(app);

    var router = express.Router();
    var handler = function(req, res){
      res.send({});
    };
    var authorizationCheck = cb(handler);
    router.get("/", authorizationCheck);
    app.use("/", router);

    return function(cb){
      supertest(app)
        .get("/")
        .end(function(err, res){
          if (err) { throw err; }
          cb(res);
        });
    }
  },

  isAuthenticated: function(user, cb){ 
    cb(null, !!user); 
  },

  notAuthenticated: function(req, res){
    res.send(403, {});
  },

  notAuthorized: function(req, res){
    res.send(403, {});
  },

  authorizedValidation: function(user, params, cb){
    cb(null, true);
  },

  unauthorizedValidation: function(user, params, cb){
    cb(null, false);
  },

  getValidUser: function(req, cb){ 
    cb(null, user); 
  },

  getNullUser: function(req, cb){
    cb(null, null);
  },

  expectResponseCode: function(response, code){
    if (response.status === 500){ 
      throw response.text;
    } else {
      expect(response.status).toBe(code);
    }
  },

  expectResponseError: function(response, msg){
    expect(response.status).toBe(500);
    var idx = response.text.indexOf("Error: " + msg);
    expect(idx).toBe(0, "Expected error message '" + msg + "'");
  }
};

module.exports = helpers;
