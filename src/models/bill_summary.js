function Bill(options) {
    if(!options){
        return this;
    }
    this.subject = options.subject;
    this.short_title = options.short_title;
    this.official_title = options.official_title;
    this.comment_count = options.comment_count;
    this.yesVote = options['yes-count'];
    this.noVote = options['no-count'];
    this.bill_id = options.bill_id;
    this.summary = options.summary;
    this.timestamp = options.timestamp;
    this.getIcon(options);
}

Bill.prototype.majorityVote = function() {
    var result = {};
    that = this;
    if(this.yesVote > this.noVote) {
        result.majority = 'Yes';
        result.percent = Math.round((100 / (this.yesVote + this.noVote)) * this.yesVote) + '%';
    }
    else if(this.yesVote < this.noVote) {
        result.majority = 'No';
        result.percent = Math.round((100 / (this.noVote + this.yesVote)) * this.noVote) + '%';
    }  else if(this.yesVote == this.noVote) {
        result.majority = '50% - 50%';
        result.percent = '';
    } else {
        that.noVotes = true;
    }
    return result;
};

Bill.prototype.goToPage = function (location) {
  location.path('bill/' + this.bill_id);
};

Bill.prototype.getIcon = function(options) {
    var i = options.subject;
    var that = this;
    if(i == 'Religion') {
        that.icon = 'icon-religion';
    }   
    if(i == 'Drugs') {
        that.icon = 'icon-smoking-area';
    }
    if(i == 'Defense') {
        that.icon = 'icon-tank';
    }    
    if(i == 'Politics') {
        that.icon = 'icon-building';
    }
    if(i == 'Gun Rights') {
        that.icon = 'icon-gun';
    }
    if(i == 'Technology') {
        that.icon = 'icon-ipad';
    }
    if(i == 'Economics') {
        that.icon = 'icon-money';
    }
    if(i == 'Social Interest') {
        that.icon = 'icon-police';
    }
}

module.exports = Bill;
