var express = require("express");
var supertest = require("supertest");

var user = {};

var helpers = {
  user: user,

  setupRoute: function(route, mustBe, cb){
    var app = new express();

    var router = express.Router();
    var handler = function(req, res, next){
      res.send({});
    };

    var authorizationCheck = cb(handler);
    router.get(route, authorizationCheck);
    app.use("/", router);

    return function(route, cb){
      if (!cb){ 
        cb = route; 
        route = "/";
      }

      supertest(app)
        .get(route)
        .end(function(err, res){
          cb(err, res);
        });
    }
  },

  isAuthenticated: function(identity, cb){ 
    cb(null, !!identity); 
  },

  notAuthenticated: function(req, res){
    res.status(403).send({});
  },

  notAuthorized: function(req, res){
    res.status(403).send({});
  },

  authorizedValidation: function(identity, params, cb){
    cb(null, true);
  },

  unauthorizedValidation: function(identity, params, cb){
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

  expectResponseError: function(response, message, errorType){
    if (!errorType) { errorType = "Error"; }

    var errorMessage = errorType + ": " + message
    expect(response.status).toBe(500);
    var idx = response.text.indexOf(errorMessage);
    expect(idx).toBe(0, "Expected error message '" + errorMessage + "', but got '" + response.text + "'");
  },

  expectRedirect: function(response, code, url){
    expect(response.status).toBe(code);
    expect(response.headers.location).toBe(url);
  }
};

module.exports = helpers;
