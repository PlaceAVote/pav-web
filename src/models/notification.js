function Notification(options) {
  this.author = options.author;
  this.author_first_name = options.author_first_name;
  this.author_img_url = options.author_img_url || '//cdn.placeavote.com/img/profile/profile-picture.png';
  this.author_last_name = options.author_last_name;
  this.bill_id = options.bill_id;
  this.bill_title = options.bill_title;
  this.body = options.body;
  this.comment_id = options.comment_id;
  this.event_id = options.event_id;
  this.notification_id = options.notification_id;
  this.read = options.read;
  this.timestamp = options.timestamp;
  this.type = options.type;
  this.user_id = options.user_id;
}

Notification.prototype.goTo = function(bill_id, comment_id, location) {
  location.path('/bill/' + bill_id + '/comment/' + comment_id);
};

module.exports = Notification;
