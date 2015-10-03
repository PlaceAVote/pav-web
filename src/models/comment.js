function Comment(options) {
  this.user_name = options.user_name;
  this.comment = options.comment;
  this.replies = options.replies;
  this.subject = options.subject;
  this.upvotes = options.upvotes;
}

module.exports = Comment;
