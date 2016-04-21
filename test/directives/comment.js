var expect = require('chai').expect;
var Comment = require('../../src/directives/comment.js');

//Dependencies
var d = {
  $compile: function() {return},
  commentService: {
    deleteComment: function(id, callback) {
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
};



describe('Comment Directive', function() {

  it('Should delete comment when user is the comment author and selects delete', function() {
    scope.comment = {
      'body': 'hello world',
      'comment_deleted': false,
    };
    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, {}, {}, {});
    scope.deleteComment();
    expect(scope.comment.comment_deleted).to.equal(true);
    expect(scope.edit).to.equal(true);
  });

  it('Should set deleteShow variable to true', function() {
    scope.comment = {
      'body': 'hello world',
      'comment_deleted': false,
    };

    scope.showDelete = true;

    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, {}, {}, {});
    scope.cancelDelete();
    expect(scope.showDelete).to.equal(false);
  });


  it('Should edit comment when user is the comment author and selects edit', function() {
    scope.comment = {
      'body': 'hello world',
      'comment_deleted': false,
    };

    scope.original = 'hey';

    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, {}, {}, {});
    scope.editComment();
    expect(scope.original).to.equal('hello world');
  });


  it('Should cancel edited comment when revert to original', function() {
    scope.comment = {
      'body': 'hey. edited',
      'comment_deleted': false,
    };

    scope.showEditTools = true;
    scope.original = 'hey';

    var subject = new Comment(d.$compile, d.commentService, d.$anchorScroll, d.$timeout, d.$location, d.$window, d.userService);
    subject.link(scope, {}, {}, {});
    scope.cancelEdit();
    expect(scope.comment.body).to.equal(scope.original);
    expect(scope.showEditTools).to.equal(false);
  });



});
