var Comment = require('./comment.js');

function CommentReplyEvent(options) {
  var options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

module.exports = CommentReplyEvent;
