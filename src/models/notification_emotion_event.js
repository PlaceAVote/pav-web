function NotificationEmotionEvent(options) {
  var that = this;
  this.author = options.author;
  this.bill_id = options.bill_id;
  this.bill_title = options.bill_title;
  this.emotional_response = options.emotional_response;
  this.first_name = options.first_name;
  this.last_name = options.last_name;
  this.notification_id = options.notification_id;
  this.timestamp = options.timestamp;
  this.type = options.type;
  this.user_id = options.user_id;
}

module.exports = NotificationEmotionEvent;
