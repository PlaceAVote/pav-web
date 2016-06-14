function DistrictLeague(options) {
  options = options || {};
  this.state = options.state;
  this.district = options.district;
  this.total = options.total || 0;
  this.league = options.league || [];
}

DistrictLeague.prototype.isAvailable = function() {
  if (!this.total || this.league.length === 0) {
    return false;
  }
  return true;
};

DistrictLeague.prototype.setState = function(state) {
  this.state = state;
};

DistrictLeague.prototype.setDistrict = function(district) {
  this.district = district;
};

DistrictLeague.prototype.populate = function(result) {
  this.league = result.league;
  this.total = result.total;
};

module.exports = DistrictLeague;
