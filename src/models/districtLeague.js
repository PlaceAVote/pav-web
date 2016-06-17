var stateMappings = require('../utils/state_mappings.js');
var numberSuffixer = require('../utils/number_suffixer.js');

// Isolated Districtleague model to be used
// as a common api by Districtleague directives.
/**
 * @class Districtleague
 * @param options {Object}
 *
 * Takes in a hashed object containing
 *  - current US state context
 *  - current Us state district context.
 *  - total votes in the league
 *  - league array (containing states, district, population,
 *    sampleSize and hits data).
 */
function DistrictLeague(options) {
  options = options || {};
  this.setState(options.state);
  this.setDistrict(options.district);
  this.total = options.total || 0;
  this.league = DistrictLeague.getSortedLeague(options.league);
}

/**
 * Given a league, add view data and sort.
 */
DistrictLeague.getSortedLeague = function(league) {
  league = league || [];
  league = DistrictLeague.mapViewData(league);
  return DistrictLeague.sort(league);
};

/**
 * Wrapper around the utils function to allow access in views.
 */
DistrictLeague.prototype.numberSuffixer = function(num) {
  return numberSuffixer(num);
};

/**
 * Calculates percentages based on hits and sampleSize.
 */
DistrictLeague.mapViewData = function(league) {
  return league.map(function(position) {
    var percentage = Math.round((position.hits / position.sampleSize) * 100);
    if (isNaN(percentage)) {
      percentage = 0;
    }
    position.stateName = stateMappings(position.state);
    position.percentage = percentage;
    return position;
  });
};

/**
 * Sorts league in order of percentages
 */
DistrictLeague.sort = function(league) {
  return league.sort(function(lastPosition, currentPosition) {
    return currentPosition.percentage - lastPosition.percentage;
  });
};

/**
 * Determines if there is any state available.
 *  - helper function for views.
 */
DistrictLeague.prototype.isAvailable = function() {
  if (!this.total || this.league.length === 0) {
    return false;
  }
  return true;
};

/**
 * Sets the value of the state property.
 * @param string : state.
 */
DistrictLeague.prototype.setState = function(state) {
  this.state = state;
  this.stateName = stateMappings(state);
};

/**
 * Sets the value of the district property.
 * @param int : district.
 */
DistrictLeague.prototype.setDistrict = function(district) {
  this.district = district;
};

/**
 * Sets the value of the league and total property.
 * @param object : contains league (array) and total (int).
 */
DistrictLeague.prototype.populate = function(result) {
  this.league = DistrictLeague.getSortedLeague(result.league);
  this.total = result.total;
};

/**
 * Method for getting the surrounding states in the league.
 * @returns array : surrounding distirct/states to the current one.
 *                  Marks the current one with a current flag to true.
 */
DistrictLeague.prototype.getSurrounding = function() {
  var index = 0;
  for (var i = 0; i < this.league.length; i++) {
    var position = this.league[i];
    // Add the league position.
    position.position = i + 1;
    // If this is position is the current state and district mark it.
    if (this.state == position.state && this.district == position.district) {
      position.current = true;
      index = i;
    }
  }
  // Return the top 5 if the index is zero.
  if (index === 0) {
    return this.league.slice(0, 5);
  }
  // Return the bottom 5 if the index is the last element of the list.
  if (index === this.league.length - 1) {
    return this.league.slice(index - 4, index + 1);
  }
  // Returns surrounding district/states.
  return this.league.slice(index - 2, index + 3);
};

/**
 * Generates an array to be used by the view to show the
 * closest leagues to the current one and the percentage of
 * their votes.
 * @returns array: surround league standings.
 */
DistrictLeague.prototype.generateLeague = function() {
  return this.getSurrounding();
};

module.exports = DistrictLeague;
