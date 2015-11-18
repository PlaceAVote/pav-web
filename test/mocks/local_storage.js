function mockLocal() {
  this.storage = [];
}

var findItem = function(mock, key){
  for(var i = 0; i < mock.storage.length; i++) {
    var result = mock.storage[i][key];
    if(result) {
     return i;
    }
  }
  return -1;
};

mockLocal.prototype.removeItem = function(key) {
   var item = findItem(this, key);
   if (item > -1) {
    this.storage.splice(item,1);
   }
};

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

