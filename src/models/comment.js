function Comment(options) {
  if(!options){
    return;
  };
  this.author = options.author;
  this.body = options.body;
  this.has_children = options.has_children;
  this.bill_id = options.bill_id;
  this.score = options.score;
  this.timestamp = options.timestamp;
  this.id = options.id;
  this.parent_id = options.parent_id;
  this.replies = [];
  this.buildChildren(options);
}

Comment.prototype.buildChildren = function(comment) {
  if(!this.replies) {
    this.replies = [];
  }
  if(!comment.has_children || !comment.replies) {
    return;
  }
  for(var i = 0; i < comment.replies.length; i++){
    this.buildChildren(comment.replies[i]);
    this.replies.push(new Comment(comment.replies[i]));
  }
};

module.exports = Comment;
