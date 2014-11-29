function Activities(){
  this.config = {
    validators: {}
  };
}

Activities.prototype.can = function(activity, validator){
  this.config.validators[activity] = validator;
};

Activities.prototype.deny = function(denier){
  this.config.denier = denier;
};

Activities.prototype.allow = function(allower){
  this.config.allower = allower;
};

module.exports = Activities;
