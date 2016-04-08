function NotificationVoteEvent(options) {
  this.bill_id = options.bill_id;
  if (RegExp('-').test(options.bill_id)) {
    this.bill_id_short = options.bill_id.split('-')[0];
  }
  this.event_id = options.event_id;
  this.notification_id = options.notification_id;
  this.read = options.read;
  this.timestamp = options.timestamp;
  this.type = options.type;
  this.user_id = options.user_id;
}

NotificationVoteEvent.prototype.goTo = function(bill_id, comment_id, location) {
  location.path('/bill/' + bill_id + '/comments/');
};

module.exports = NotificationVoteEvent;
