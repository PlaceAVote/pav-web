var Comment = require('./comment.js');

function DislikeCommentEvent(options) {
  var options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

module.exports = DislikeCommentEvent;
