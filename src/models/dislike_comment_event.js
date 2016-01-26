var Comment = require('./comment.js');

function DislikeCommentEvent(options) {
  options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

module.exports = DislikeCommentEvent;
