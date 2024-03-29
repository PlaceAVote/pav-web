var expect = require('chai').expect;
var CommentService = require('../../src/services/comment_service.js');
var Comment = require('../../src/models/comment.js');

describe('Comment Service', function() {
  var authService = {
    getAccessToken: function() {
      return 'PAV_AUTH_TOKEN TOKEN'
    }
  }
  var userService = {
    getUser: function() {
      return {
        email: 'test@test.com'
      }
    },
  };
  describe('Reply', function() {
    it('takes in a reply', function(done) {
      var subject = new CommentService();
      subject.reply(undefined, undefined, undefined, function(err, result) {
        expect(err).to.eql('No Comment');
        done();
      });
    });
    it('takes a bill id', function(done) {
      var subject = new CommentService();
      subject.reply('my cool reply', undefined, undefined, function(err, result) {
        expect(err).to.eql('No Id');
        done();
      });
    });
    it('takes a parent id', function(done) {
      var subject = new CommentService();
      subject.reply('my cool reply', 'bill-id', undefined, function(err, result) {
        expect(err).to.eql('No Parent Id');
        done();
      });
    });
    it('Calls Resource function with correct params', function(done) {
      function mockResource(url, params, method){
        expect(url).to.contain('/comments/hw3/reply');
        expect(params).to.eql(undefined);
        expect(method.reply.headers.Authorization).to.eql('PAV_AUTH_TOKEN TOKEN');
        done();
      }
      mockResource.prototype.reply = function(object, onLoad, onError) {
      };
      var subject = new CommentService(mockResource, userService, authService);
      subject.reply('Witty Retort', {type: 'bill', bill_id: 'hr2-114'}, 'hw3', function(err, resource) {
      });
    });
    it('calls resource reply with correct object', function(done) {
      var expected = {
        bill_id: 'hr2-114',
        body: 'Witty Retort',
      };
      function mockResource(url, params, method){
      }
      mockResource.prototype.reply = function(object, onLoad, onError) {
        expect(object).to.eql(expected);
        done();
      };
      var subject = new CommentService(mockResource, userService, authService);
      subject.reply('Witty Retort', {type: 'bill', id: 'hr2-114'}, '12312', function(err, resource) {
      });
    });
    it('calls on Error when server returns an error', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.reply = function(object, onLoad, onError) {
        onError('Error');
      };
      var subject = new CommentService(mockResource, userService, authService);
      subject.reply('Witty Retort', 'hr2-114', 'hw3', function(err, resource) {
        expect(err).to.eql('Error');
        done();
      });
    });
    it('calls on Load with a new Comment when server respone returns success', function(done) {
      var c = require('../fixtures/comments.js');
      function mockResource(url, params, method){
      }
      mockResource.prototype.reply = function(object, onLoad, onError) {
        onLoad(c);
      };
      var subject = new CommentService(mockResource, userService, authService);
      subject.reply('Witty Retort', 'hr2-114', 'hw3', function(err, resource) {
        expect(err).to.eql(undefined);
        expect(resource).to.be.instanceof(Comment);
        expect(resource).to.be.eql(new Comment(c));
        done();
      });
    });
  });
  describe('Like', function() {
    it('Takes a Comment Id', function(done) {
      var subject = new CommentService();
      subject.like(undefined, 'billId', function(err, result) {
        expect(err).to.eql('No Comment Id');
        done();
      });
    });
    it('Returns Error if user is not defined', function(done) {
      var userService = {
        getUser: function() {
          return;
        },
      };
      var subject = new CommentService(undefined, userService);
      subject.like('CommentID', undefined, function(err, result) {
        expect(err).to.eql('No Context Defined');
        done();
      });
    });
    it('Returns Error if user email is not defined', function(done) {
      var subject = new CommentService(undefined, userService);
      subject.like('CommentID', '', function(err, result) {
        expect(err).to.eql('No Context Defined');
        done();
      });
    });
    it('Calls Resource with correct params', function(done) {
      function  mockResource(url, params, method) {
        expect(url).to.contain('/comments/CommentID/like');
        expect(params).to.eql(undefined);
        expect(method.like.headers.Authorization).to.eql('PAV_AUTH_TOKEN TOKEN');
        this.like = function(body, onLoad, onError) {
          expect(body).to.eql({bill_id: '23123'});
          done();
        }
      }
      var subject = new CommentService(mockResource, userService, authService);
      subject.like('CommentID', {type: 'bill', id: '23123'}, function(err, result) {
      });
    });
    it('Returns Error when server returns error', function(done) {
      function  mockResource(url, params, method) {
        this.like = function(body, onLoad, onError) {
          return onError('Error');
        }
      }
      var subject = new CommentService(mockResource, userService, authService);
      subject.like('CommentID', {id: '123213', type: 'bill'}, function(err, result) {
        expect(err).to.eql('Error');
        done();
      });
    });
    it('Returns result', function(done) {
      function  mockResource(url, params, method) {
        this.like = function(body, onLoad, onError) {
          return onLoad('response');
        }
      }
      var subject = new CommentService(mockResource, userService, authService);
      subject.like('CommentID', 'bill-id', function(err, result) {
        expect(err).to.eql(undefined);
        expect(result).to.eql(true);
        done();
      });
    });
  });
  describe('Dislike', function() {
    it('Takes a Comment Id', function(done) {
      var subject = new CommentService();
      subject.dislike(undefined, 'billId', function(err, result) {
        expect(err).to.eql('No Comment Id');
        done();
      });
    });
    it('Returns Error if billId is not defined', function(done) {
      var subject = new CommentService(undefined, undefined, userService);
      subject.dislike('CommentID', undefined,  function(err, result) {
        expect(err).to.eql('No Context Defined');
        done();
      });
    });
    it('Returns Error if user email is not defined', function(done) {
      var subject = new CommentService(undefined, userService);
      subject.dislike('CommentID', '', function(err, result) {
        expect(err).to.eql('No Context Defined');
        done();
      });
    });
    it('Calls Resource with correct params', function(done) {
      function  mockResource(url, params, method) {
        expect(url).to.contain('/comments/CommentID/dislike');
        expect(params).to.eql(undefined);
        expect(method.dislike.headers.Authorization).to.eql('PAV_AUTH_TOKEN TOKEN');
        this.dislike = function(body, onLoad, onError) {
          expect(body).to.eql({bill_id: '23123'});
          done();
        }
      }
      var subject = new CommentService(mockResource, userService, authService);
      subject.dislike('CommentID', {id: '23123', type: 'bill'}, function(err, result) {
      });
    });
    it('Returns Error when server returns error', function(done) {
      function  mockResource(url, params, method) {
        this.dislike = function(body, onLoad, onError) {
          return onError('Error');
        }
      }
      var subject = new CommentService(mockResource, userService, authService);
      subject.dislike('CommentID', 'bill', function(err, result) {
        expect(err).to.eql('Error');
        done();
      });
    });
    it('Returns result', function(done) {
      function  mockResource(url, params, method) {
        this.dislike = function(body, onLoad, onError) {
          return onLoad('response');
        }
      }
      var subject = new CommentService(mockResource, userService, authService);
      subject.dislike('CommentID', 'billId', function(err, result) {
        expect(err).to.eql(undefined);
        expect(result).to.eql(true);
        done();
      });
    });
  });
});
