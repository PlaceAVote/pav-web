function mockLocal() {
  this.storage = [];
}
mockLocal.prototype.setItem = function(key, value) {
  var item = {};
  item[key] = value;
  this.storage.push(item);
};
mockLocal.prototype.getItem = function(key) {
  for(var i = 0; i < this.storage.length; i++) {
    var result = this.storage[i][key];
    if(result) {
     return result;
    }
  }
};

module.exports = mockLocal;

