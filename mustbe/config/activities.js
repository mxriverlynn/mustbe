function Activities(){
  this.validators = {};
}

Activities.prototype.getValidators = function(){
  return this.validators;
};

Activities.prototype.can = function(activity, validator){
  this.validators[activity] = validator;
};

Activities.prototype.deny = function(denier){
  this.denier = denier;
};

Activities.prototype.allow = function(allower){
  this.allower = allower;
};

module.exports = Activities;
