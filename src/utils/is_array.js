module.exports = function(obj) {
  if(!obj) {
    return;
  }
  return Object.prototype.toString.call(obj) === '[object Array]';
};
