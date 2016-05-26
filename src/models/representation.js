function Representation(options) {
  this.population = options.population;
  this.sampleSize = options.sampleSize;
  this.votesTotal = options.votes.total;
  this.gender = options.gender;
  this.votes = options.votes;
  this.getRepresentationScore(options);
  this.getRepresentationPercent(options);
  this.getVotePercent(options);
}

Representation.prototype.getRepresentationScore = function(options) {
  this.representationScore = this.votesTotal + '/' + this.sampleSize;
};


Representation.prototype.getVotePercent = function(options) {
  var percentNo = (options.votes.no / (options.votes.no + options.votes.yes)) * 100;
  var percentYes = (options.votes.yes / (options.votes.no + options.votes.yes)) * 100;
  var voteNo = {
    val: percentNo,
    label: 'Against',
    className: 'against'
  };
  var voteYes = {
    val: percentYes,
    label: 'In Favor',
    className: 'favor',
  };
  this.votes.stats = [voteNo, voteYes];
}

Representation.prototype.getRepresentationPercent = function(options) {
  if (this.votesTotal >= options.sampleSize) {
    this.representationPercent = 100;
  } else {
    this.representationPercent = Math.ceil((this.votesTotal / this.sampleSize) * 100);
  }
};


module.exports = Representation;
