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
  //img_placeholder until img is returned with comments call
  this.img_url = 'http://i159.photobucket.com/albums/t154/MYU701/LOST/unreality/JohnLocke-orange-2.jpg'
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


Comment.prototype.showReplyInput = function() {
 this.replyInput = true;
};

Comment.prototype.hideReplyInput = function() {
 this.replyInput = false;
};

Comment.prototype.reply = function(billId, service) {
  var that = this;
  service.reply(this.reply, billId, this.id, function(err, response) {
    if(err) {
      that.replyFailed = true;
    }
    else if(response) {
      that.replies.push(response);
    }
  });
};

Comment.prototype.like = function(service) {
  var that = this;
  service.like(this.id, function(err, response) {
    if(err) {
      that.likeFailed = true;
    }
    else if(response) {
      that.liked = true;
    }
  });
};


Comment.prototype.dislike = function(service) {
  var that = this;
  service.dislike(this.id, function(err, response) {
    if(err) {
      that.dislikeFailed = true;
    }
    else if(response) {
      that.disliked = true;
    }
  });
};

module.exports = Comment;

