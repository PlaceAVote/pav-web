var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var Comment;
var CommentModel = require('../../src/models/comment.js');

//Dependencies
var d = {
  $compile: (function(a) {
    return a;
  })(this),
  commentService: {
    deleteComment: function(id, context, callback) {
      return callback(undefined, true);
    },
    edit: function(id, body, callback) {
        callback(undefined, {body: body});
    },
  },
  $anchorScroll: function() {return},
  $timeout: function(f) {return f();},
  $location: function() {return},
  $window: function() {return},
  userService: {
    isUserMe: function() {return true;},
  },
};


var scope = {
  $watch: function() {return},
  comment: {
    replies: null,
  },
};

var El = function() {
  this.append = function() {return this;};
  this.html = function() {return this;};
  this.contents = function() {return this;};
  this.remove = function() {return this;};
};

var element = new El();

// element.prototype.remove = function() {
//   return;
// };



describe('Comment Directive', function() {
  jsdom();
  before(function() {
    Comment = require('../../src/directives/comment.js');
  });
  it('Should delete comment when user is the comment author and selects delete', function() {
    scope.comment = new CommentModel({
      'body': 'hello world',
      'comment_deleted': false,
    });
    scope.comment.replies = undefined;
    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, element, {}, {});
    scope.deleteComment();
    expect(scope.comment.comment_deleted).to.equal(true);
    expect(scope.edit).to.equal(true);
  });

  it('Should set deleteShow variable to true', function() {
    scope.comment = new CommentModel({
      'body': 'hello world',
      'comment_deleted': false,
    });

    scope.showDelete = true;


    scope.comment.replies = undefined;
    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, element, {}, {});
    scope.cancelDelete();
    expect(scope.showDelete).to.equal(false);
  });


  it('Should edit comment when user is the comment author and selects edit', function() {
    scope.comment = new CommentModel({
      'body': 'hello world',
      'comment_deleted': false,
    });

    scope.original = 'hey';


    scope.comment.replies = undefined;
    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, element, {}, {});
    scope.editComment();
    expect(scope.original).to.equal('hello world');
  });


  it('Should cancel edited comment when revert to original', function() {
    scope.comment = new CommentModel({
      'body': 'hello world',
      'comment_deleted': false,
    });

    scope.showEditTools = true;
    scope.original = 'hey';

    scope.comment.replies = undefined;
    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, element, {}, {});
    scope.cancelEdit();
    expect(scope.comment.body).to.equal(scope.original);
    expect(scope.showEditTools).to.equal(false);
  });


});
