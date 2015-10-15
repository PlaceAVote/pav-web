function CurrentVote(id, yes, no){
  this.id = id;
  this.yes = yes || 0;
  this.no = no || 0;
  this.getPercentage();
}

CurrentVote.prototype.getPercentage = function(){
  this.yesPercentage = Math.round((100 / (this.yes+ this.no)) * this.yes);
  this.noPercentage = Math.round((100 / (this.no+ this.yes)) * this.no);
};

module.exports = CurrentVote;

