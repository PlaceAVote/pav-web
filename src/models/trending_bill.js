function TrendingBill(options) {
this.bill_id = options.bill_id;
this.comment_count = options.comment_count;
this.noVote = options['no-count'];
this.yesVote = options['yes-count'];
this.official_title = options.official_title;
this.short_title = options.short_title;
this.summary = options.summary;
this.getIcon(options);
}

TrendingBill.prototype.majorityVote = function() {
    var result = {};
    that = this;
    if(this.yesVote > this.noVote) {
        result.majority = 'Yes';
        result.percent = Math.round((100 / (this.yesVote + this.noVote)) * this.yesVote) + '%';
    }
    else if(this.yesVote < this.noVote) {
        result.majority = 'No';
        result.percent = Math.round((100 / (this.noVote + this.yesVote)) * this.noVote) + '%';
    } else if(this.yesVote == this.noVote) {
    	result.majority = '50% - 50%';
    	result.percent = '';
    } 
    else {
        that.noVotes = true;
    }
    return result;
};

TrendingBill.prototype.goToPage = function (location) {
  location.path('bill/' + this.bill_id);
};

TrendingBill.prototype.getIcon = function(options) {
    var that = this;
    if(!options.subject) {
        that.icon = 'icon-building';
        return;
    }
    var i = options.subject;
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

module.exports = TrendingBill;