var Comment = require('./comment.js');

function LikeCommentEvent(options) {
  options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

module.exports = LikeCommentEvent;
