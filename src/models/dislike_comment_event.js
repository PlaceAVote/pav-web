var Comment = require('./comment.js');

function DislikeCommentEvent(options) {
  options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

DislikeCommentEvent.prototype.goTo = function(location, url) {
  location.path(url);
};

module.exports = DislikeCommentEvent;
