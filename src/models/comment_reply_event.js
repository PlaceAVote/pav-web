var Comment = require('./comment.js');
function CommentReplyEvent(options) {
  options = options || {};
  this.type = options.type;
  this.notification_id = options.notification_id;
  this.read = options.read;
  this.comment = new Comment(options);
}

CommentReplyEvent.prototype.goToBill = function(billId, location) {
  location.path('/bill/' + billId);
};

module.exports = CommentReplyEvent;
