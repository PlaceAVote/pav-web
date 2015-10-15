function CurrentVote(id, yes, no){
  this.id = id;
  this.yes = yes;
  this.no = no;
  this.getPercentage();
}

CurrentVote.prototype.getPercentage = function(){
  if(!this.yes || !this.no){
    return;
  }
  this.yesPercentage = Math.round((100 / (this.yes+ this.no)) * this.yes);
  this.noPercentage = Math.round((100 / (this.no+ this.yes)) * this.no);
};

module.exports = CurrentVote;

