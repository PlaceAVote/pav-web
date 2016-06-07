// Isolated Demographics model to be used
// as a common api by Demographics directives.
/**
 * @class Demographics
 * @param options {Object}
 *
 * Takes in a hashed object containing
 * a demographic.
 */
function Demographics(dependencies) {
  var options = dependencies || {};
  this.available = false;
}

Demographics.prototype.setBusy = function(busy) {
  this.busy = busy;
};

Demographics.prototype.getBusy = function(busy) {
  return this.busy;
};

Demographics.prototype.setAvailable = function(available) {
  this.available = available;
};

Demographics.prototype.getAvailable = function() {
  return this.available;
};

Demographics.prototype.populate = function(demographics) {
  this.setDemographics(demographics);
  this.setRepresentationPercent();
  this.setRepresentationScore();
  this.setVotePercent();
  this.setAvailable(true);
  this.setBusy(false);
};

Demographics.prototype.setDemographics = function(demographics) {
  this.demographics = demographics;
};


Demographics.prototype.setRepresentationScore = function() {
  if (!this.demographics) {
    return;
  }
  this.representationScore = this.demographics.votes.total + '/' + this.demographics.sampleSize;
};

Demographics.prototype.setVotePercent = function() {
  if (!this.demographics) {
    return;
  }
  var votes = this.demographics.votes;
  var percentNo = (votes.no / (votes.total)) * 100;
  var percentYes = (votes.yes / (votes.total)) * 100;
  var voteNo = {
    val: Math.round(percentNo * 100) / 100,
    label: 'Against',
    className: 'against',
  };

  var voteYes = {
    val: Math.round(percentYes * 100) / 100,
    label: 'In Favor',
    className: 'favor',
  };
  this.stats = [voteNo, voteYes];
};

Demographics.prototype.setRepresentationPercent = function() {
  if (!this.demographics) {
    return;
  }
  if (this.demographics.votes.total >= this.demographics.sampleSize) {
    this.representationPercent = 100;
  } else {
    this.representationPercent = Math.ceil((this.demographics.votes.total / this.demographics.sampleSize) * 100);
  }
};

module.exports = Demographics;
