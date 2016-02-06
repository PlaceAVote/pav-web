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
}

module.exports = Issue;
