function ParameterMap(){
  this.maps = {};
}

ParameterMap.prototype.getMaps = function(){
  return this.maps;
};

ParameterMap.prototype.map = function(activity, mapper){
  this.maps[activity] = mapper;
};

module.exports = ParameterMap;
