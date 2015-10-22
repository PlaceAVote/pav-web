function Legislator(options){
  if(!options) {
    return;
  }
  this.properties = options;
}

Legislator.prototype.getImageUrl = function(){
  return this.properties.img_urls['200px'];
};

module.exports = Legislator;

