function Registry(defaultValue){
  this._defaultValue = defaultValue;
  this._values = Object.create(null);
}

Registry.prototype.register = function(name, value){
  this._values[name] = value;
};

Registry.prototype.get = function(name){
  var value;
  if (this.hasValue(name)){
    value = this._values[name];
  } else {
    value = this._defaultValue;
  }
  return value;
};

Registry.prototype.hasValue = function(name){
  return Object.prototype.hasOwnProperty.call(this._values, name);
};

module.exports = Registry;
