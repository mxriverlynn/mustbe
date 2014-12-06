function User(username, password){
  this.username = username;
  this.password = password;
  this.roles = [];

  if (username === "admin"){
    this.roles.push("admin");
  }
};

User.login = function(username, password, cb){
  // this is where you would have real logic to log the user in
  // using a database or whatever other service you want
  var user;
  if (username) {
    user = new User(username, password);
  }
  cb(null, user);
};

User.loginFromCookie = function(cookie, cb){
  // this would involve database logic to convert a cookie id
  // in to a user object, most likely. i'm just hard coding it
  // for demo purposes
  var user;
  if (cookie) {
    user = new User(cookie);
  }
  cb(null, user);
};

module.exports = User;
