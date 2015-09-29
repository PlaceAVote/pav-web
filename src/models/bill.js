function Bill(options) {
    if(!options){
        return this;
    }
    this.subject = options.subject;
    this.short_title = options.short_title;
    this.total_comments = options.total_comments;
    this.yesVote = options.votes.yes;
    this.noVote = options.votes.no;
    this.bill_id = options.bill_id;
    this.summary = options.summary;
}

Bill.prototype.majorityVote = function() {
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
