function Comment(options) {
  if(!options){
    return;
  };
  this.author = options.author;
  this.author_first_name = options.author_first_name;
  this.author_last_name = options.author_last_name;
  this.body = options.body;
  this.has_children = options.has_children;
  this.bill_id = options.bill_id;
  this.bill_title = options.bill_title;
  this.score = options.score;
  this.timestamp = options.timestamp;
  this.id = options.id || options.comment_id;
  this.parent_id = options.parent_id;
  this.jsonReplies = options.replies;
  this.replies = [];
  this.deep = 0;
  this.author_img_url = options.author_img_url || '//cdn.placeavote.com/img/profile/profile-picture.png';
  this.scored = options.scored;
  this.liked = options.liked;
  this.disliked = options.disliked;
  this.type = options.type || 'comment';
}

Comment.buildChildren = function(comment, deep, reply) {
  if(!deep) {
    deep = 0;
  }

  if(reply) {
    comment.showChildren = true;
  }

  if(comment.id == reply) {
    comment.selected = 'comment-selected';
  }

  comment.deep = deep;
  if(!comment.replies) {
    comment.replies = [];
  }
  if(!comment.has_children) {
    return;
  }
  for(var i = 0; i < comment.jsonReplies.length; i++){
    var child = new Comment(comment.jsonReplies[i]);
    Comment.buildChildren(child, deep+1, reply);
    comment.replies.push(child);
  }
};

Comment.prototype.show = function() {
  this.showChildren = true;
};

Comment.prototype.hide = function() {
  this.showChildren = false;
};

Comment.prototype.showReplyInput = function() {
 this.replyInput = true;
};

Comment.prototype.hideReplyInput = function() {
 this.replyInput = false;
 this.replyText = undefined;
};

Comment.prototype.reply = function(billId, service) {
  var that = this;
  service.reply(this.replyText, billId, this.id, function(err, response) {
    if(err) {
      that.replyFailed = true;
    }
    else if(response) {
      response.deep = that.deep + 1;
      that.replies.push(response);
    }
    that.hideReplyInput();
  });
};

Comment.prototype.like = function(service) {
 
  var that = this;
 
  if (this.liked && !this.scoring) {
      that.scoring = true;
      service.revoke(this.id, this.bill_id, 'like', function(err, response) {
      if(err) {
        that.likeFailed = true;
        that.scoring = false;
      }
      else if(response) {
        that.scoring = false;
        that.liked = false;
        that.scored = false;
        that.score--;
        return;
      }
    });
  }

  if (this.disliked && !this.scoring) {
      that.scoring = true;
      service.revoke(this.id, this.bill_id,'dislike', function(err, response) {
      if(err) {
        that.dislikeFailed = true;
        that.scoring = false;
      }
      else if(response) {
        that.scoring = false;
        that.disliked = false;
        that.scored = false;
        that.score++;
      }
    });
  }

  if(!this.liked && !this.scoring) {
      that.scoring = true;
      service.like(this.id, this.bill_id, function(err, response) {
      if(err) {
        that.likeFailed = true;
        that.scoring = false;
      }
      else if(response) {
        that.scoring = false;
        that.liked = true;
        that.scored = true;
        that.score++;
      }
    });
  }

};


Comment.prototype.dislike = function(service) {
  var that = this;

    if (this.disliked && !this.scoring) {
      that.scoring = true;
      service.revoke(this.id, this.bill_id,'dislike', function(err, response) {
      if(err) {
        that.scoring = false;
        that.dislikeFailed = true;
      }
      else if(response) {
        that.scoring = false;
        that.disliked = false;
        that.scored = false;
        that.score++;
        return;
      }
    });
  }


    if (this.liked && !this.scoring) {
      that.scoring = true;
      service.revoke(this.id, this.bill_id, 'like', function(err, response) {
      if(err) {
        that.likeFailed = true;
        that.scoring = false;
      }
      else if(response) {
        that.scoring = false;
        that.liked = false;
        that.scored = false;
        that.score--;
      }
    });
  }


  if(!this.disliked && !this.scoring) {
    that.scoring = true;
    service.dislike(this.id, this.bill_id, function(err, response) {
      if (err) {
        that.dislikeFailed = true;
        that.scoiring = false;
      }
      else if(response) {
        that.scoring = false;
        that.disliked = true;
        that.scored = true;
        that.score--;
      }
    });
  }

};




module.exports = Comment;

