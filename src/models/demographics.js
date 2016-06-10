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
  this.setRepresentationPercent(demographics);
  this.setRepresentationScore(demographics);
  this.setVotePercent(demographics);
  this.setUnderRepresentedGenderGroup(demographics);
  this.setMinorityAgeRange(demographics);
  this.setAvailable(true);
  this.setBusy(false);
  this.isUnderRepresented();
};

Demographics.prototype.setDemographics = function(demographics) {
  this.demographics = demographics;
};


Demographics.prototype.setRepresentationScore = function(demographics) {
  if (!demographics) {
    return;
  }
  this.representationScore = demographics.votes.total + '/' + demographics.sampleSize;
};

Demographics.prototype.setVotePercent = function(demographics) {
  if (!demographics) {
    return;
  }
  var votes = demographics.votes;
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
  if (!this.demographics) {
    return;
  }
  this.demographics.votes.total += 1;
  if (favor) {
    this.demographics.votes.yes += 1;
  } else {
    this.demographics.votes.no += 1;
  }
  this.setVotePercent(this.demographics);
};

Demographics.prototype.setRepresentationPercent = function(demographics) {
  if (!demographics) {
    return;
  }
  if (demographics.votes.total >= demographics.sampleSize) {
    this.representationPercent = 100;
  } else {
    this.representationPercent = Math.ceil((demographics.votes.total / demographics.sampleSize) * 100);
  }
};

Demographics.prototype.isUnderRepresented = function() {
  return this.representationPercent < 100;
};

Demographics.prototype.setUnderRepresentedGenderGroup = function(demographics) {
  if (!demographics) {
    return;
  }
  var total = demographics.votes.total;
  var maleTotal = demographics.gender.male.votes.total;
  var femaleTotal = demographics.gender.female.votes.total;
  var underRepresentedGroup = maleTotal < femaleTotal ? 'male' : 'female';
  this.underRepresentedGenderGroup = {
    percentage: toPercent(demographics.gender[underRepresentedGroup].votes.total, total),
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

function mergeAgeRanges(demographics) {
  var ageRanges = demographics.gender.male.ranges;
  ageRanges = ageRanges.concat(demographics.gender.female.ranges);
  ageRanges = ageRanges.concat(demographics.gender.nonBinary.ranges);
  var mergedRanges = {};
  ageRanges.forEach(function(range) {
    var key = range.minAge + '-' + range.maxAge;
    if (mergedRanges[key]) {
      mergedRanges[key].votes.total += range.votes.total;
    } else {
      mergedRanges[key] = range;
    }
  });
  return mergedRanges;
}

function extractHighestRange(mergedRanges) {
  var highestRange;
  for (var key in mergedRanges) {
    var range = mergedRanges[key];
    if (!highestRange) {
      highestRange = range;
    }
    if (range.votes.total <= highestRange.votes.total) {
      highestRange = range;
    }
  }
  return highestRange;
}

function formatedAgeRange(highestRange, demographics) {
  var ageRange;
  if (highestRange.minAge === 60) {
    ageRange = highestRange.minAge + '+';
  } else {
    ageRange = highestRange.minAge + '-' + highestRange.maxAge;
  }
  return {
    ageRange: ageRange,
    percentage: toPercent(highestRange.votes.total, demographics.votes.total),
  };
}

Demographics.prototype.setMinorityAgeRange = function(demographics) {
  if (!demographics) {
    return;
  }
  var mergedRanges = mergeAgeRanges(demographics);
  var highestRange = extractHighestRange(mergedRanges);
  this.minorityAgeRange = formatedAgeRange(highestRange, demographics);
};

module.exports = Demographics;
