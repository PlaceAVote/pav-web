function Bill(options) {
    if(!options){
        return this;
    }
    this.topic = options.topic;
    this.name = options.name;
    this.comments = options.comments;
    this.yesVote = options.yesVote;
    this.noVote = options.noVote;
}

Bill.prototype.majorityVote = function(){
    var result = {};
    if(this.yesVote > this.noVote) {
        result.majority = 'yes';
        result.percent = Math.round((100 / (this.yesVote + this.noVote)) * this.yesVote);
    }
    else {
        result.majority = 'no';
        result.percent = Math.round((100 / (this.noVote + this.yesVote)) * this.noVote);
    }
    return result;
};

module.exports = Bill;
