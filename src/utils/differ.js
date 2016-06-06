// Diffs objects and returns any differnces.
// Non recursive.
function differ(original, changed) {
  if (!changed) {
    return null;
  }
  var difference = {};
  for (var key in changed) {
    if (original[key] !== changed[key]) {
      difference[key] = changed[key];
    }
  }
  if (Object.keys(difference).length === 0 && difference.constructor === Object) {
    return null;
  }
  return difference;
}

module.exports = differ;
