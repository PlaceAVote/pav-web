function Issue(options) {
  if (!options) {
    return this;
  }
  this.type = 'issue';
  this.issue_id = options.issue_id;
  this.bill_id = options.bill_id;
  this.bill_title = options.bill_title;
  this.comment = options.comment;
  this.article_link = options.article_link;
  this.article_title = options.article_title;
  this.article_img = options.article_img;
  this.timestamp = options.timestamp;
  this.author_id = options.author_id;
  this.author_first_name = options.first_name;
  this.author_last_name = options.last_name;
  this.emotional_response = options.emotional_response;
  this.author_img_url = options.img_url || '//cdn.placeavote.com/img/profile/profile-picture.png';
  this.negative_responses = options.negative_responses;
  this.neutral_responses = options.neutral_responses;
  this.positive_responses = options.positive_responses;
}

Issue.prototype.goToBill = function(location) {
  location.path('bill/' + this.bill_id);
};

Issue.prototype.goToProfile = function(location) {
  location.path('profile/' + this.author_id);
};

module.exports = Issue;
