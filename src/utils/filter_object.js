// Removes all falsey properties which are not bools or ints
function filterObject(object) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var key in object) {
    if (object[key]) {
      result[key] = object[key];
    }
    if (typeof object[key] === 'number' || typeof object[key] === 'boolean') {
      result[key] = object[key];
    }
  }
  return result;
}

module.exports = filterObject;
