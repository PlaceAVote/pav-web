var Comment = require('./comment.js');
function CommentReplyEvent(options) {
  var options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

CommentReplyEvent.prototype.goToBill = function(billId, location) {
  location.path('/bill/'+ billId);
};

module.exports = CommentReplyEvent;
