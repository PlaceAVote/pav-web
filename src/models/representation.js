function Representation(options) {
  this.population = options.population;
  this.sampleSize = options.sampleSize;
  this.votesTotal = options.votes.total;
  this.gender = options.gender;
  this.votes = options.votes;
  this.getRepresentationScore(options);
  this.getRepresentationPercent(options);
}

Representation.prototype.getRepresentationScore = function(options) {
  this.representationScore = this.votesTotal + '/' + this.sampleSize;
};


Representation.prototype.getRepresentationPercent = function(options) {
  if (this.votesTotal >= options.sampleSize) {
    this.representationPercent = 100;
  } else {
    this.representationPercent = Math.ceil((this.votesTotal / this.sampleSize) * 100);
  }
};


module.exports = Representation;
