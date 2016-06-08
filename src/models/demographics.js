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
  this.state = options.state;
  this.district = options.district;
}

function toPercent(subsection, total) {
  var percent = (subsection / (total)) * 100;
  return Math.round(percent * 100) / 100;
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
  this.setUnderRepresentedGenderGroup();
  this.isUnderRepresented();
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
  var voteNo = {
    val: toPercent(votes.no, votes.total),
    label: 'Against',
    className: 'against',
  };

  var voteYes = {
    val: toPercent(votes.yes, votes.total),
    label: 'In Favor',
    className: 'favor',
  };
  this.stats = [voteNo, voteYes];
};

Demographics.prototype.updateVotePercent = function(favor) {
  this.demographics.votes.total += 1;
  if (favor) {
    this.demographics.votes.yes += 1;
  } else {
    this.demographics.votes.no += 1;
  }
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

Demographics.prototype.isUnderRepresented = function() {
  return this.representationPercent < 100;
};

Demographics.prototype.setUnderRepresentedGenderGroup = function() {
  if (!this.demographics) {
    return;
  }
  var total = this.demographics.votes.total;
  var maleTotal = this.demographics.gender.male.votes.total;
  var femaleTotal = this.demographics.gender.female.votes.total;
  var underRepresentedGroup = maleTotal < femaleTotal ? 'male' : 'female';
  this.underRepresentedGenderGroup = {
    percentage: toPercent(this.demographics.gender[underRepresentedGroup].votes.total, total),
    gender: underRepresentedGroup,
  };
};

Demographics.prototype.updateRepresentation = function() {
  if (!this.demographics) {
    return;
  }
  this.representationScore = this.demographics.votes.total + '/' + this.demographics.sampleSize;
  if (this.representationPercent >= 100) {
    return;
  }
  this.representationPercent = Math.ceil((this.demographics.votes.total / this.demographics.sampleSize) * 100);
};

module.exports = Demographics;
