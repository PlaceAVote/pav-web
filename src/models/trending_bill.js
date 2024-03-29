var Icon = require('./icon.js');
function TrendingBill(options) {
  this.type = 'bill';
  this.subject = options.subject;
  this.bill_id = options.bill_id;
  this.comment_count = options.comment_count;
  this.noVote = options['no-count'];
  this.yesVote = options['yes-count'];
  this.official_title = options.official_title;
  this.short_title = options.short_title;
  this.summary = options.summary;
  this.featured_img_link = options.featured_img_link;
  if (RegExp('-').test(options.bill_id)) {
    this.bill_id_short = options.bill_id.split('-')[0];
  }
  this.getIcon(options);
  this.trendTitle = options.featured_bill_title || options.short_title || options.official_title;
  this.feed_title = this.trendTitle;
}

TrendingBill.prototype.majorityVote = function() {
  var result = {};
  that = this;
  if (this.yesVote > this.noVote) {
    result.majority = 'Yes';
    result.percent = Math.round((100 / (this.yesVote + this.noVote)) * this.yesVote) + '%';
  } else if (this.yesVote < this.noVote) {
    result.majority = 'No';
    result.percent = Math.round((100 / (this.noVote + this.yesVote)) * this.noVote) + '%';
  } else if (this.yesVote == this.noVote) {
    result.majority = '50% - 50%';
    result.percent = '';
  } else {
    that.noVotes = true;
  }
  return result;
};

TrendingBill.prototype.goToPage = function(location) {
  location.path('bill/' + this.bill_id);
};

TrendingBill.prototype.getIcon = function(options) {
  var that = this;
  new Icon(options, function(i) {
    that.icon = i;
  });
};

module.exports = TrendingBill;
