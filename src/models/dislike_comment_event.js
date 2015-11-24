var Comment = require('./comment.js');

function DislikeCommentEvent(options) {
  var options = options || {};
  this.comment = new Comment(options);
}

module.exports = DislikeCommentEvent;
