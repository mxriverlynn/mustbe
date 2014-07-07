function Activities(){
  this.validators = {};
}

Activities.prototype.getValidators = function(){
  return this.validators;
};

Activities.prototype.can = function(activity, validator){
  this.validators[activity] = validator;
};

module.exports = Activities;
