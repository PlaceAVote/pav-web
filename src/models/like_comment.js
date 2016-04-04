var Comment = require('./comment.js');

function LikeCommentEvent(options) {
  options = options || {};
  this.type = options.type;
  this.comment = new Comment(options);
}

LikeCommentEvent.prototype.goTo = function(location, url) {
  location.path(url);
};

module.exports = LikeCommentEvent;
