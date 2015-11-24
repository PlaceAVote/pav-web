var Comment = require('./comment.js');

function LikeCommentEvent(options) {
  var options = options || {};
  this.comment = new Comment(options);
}

module.exports = LikeCommentEvent;
