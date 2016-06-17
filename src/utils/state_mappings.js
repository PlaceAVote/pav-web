var statesHash = require('./states_hash.json');

/**
 * Given a states initials, returns the full name of the state.
 */
function stateMappings(initials) {
  return statesHash[initials] || initials;
}
module.exports = stateMappings;
