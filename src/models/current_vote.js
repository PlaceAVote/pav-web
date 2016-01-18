function CurrentVote(id, yes, no) {
  this.id = id;
  this.yes = yes || 0;
  this.no = no || 0;
  this.getPercentage();
}

CurrentVote.prototype.getPercentage = function() {
  this.yesPercentage = 0;
  this.noPercentage = 0;
  var yp = Math.round((100 / (this.yes + this.no)) * this.yes);
  var np = Math.round((100 / (this.no + this.yes)) * this.no);
  if (!isNaN(yp)) {
    this.yesPercentage = yp;
  }
  if (!isNaN(np)) {
    this.noPercentage = np;
  }
};

module.exports = CurrentVote;

