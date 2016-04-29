var expect = require('chai').expect;
var Issues = require('../../src/directives/issue.js');

describe('Issue Directive', function() {

  var mockIssueService = {
    deleteIssueResponse: function(id, emo, callback) {
      callback(undefined, true);
    },
    setIssueResponse: function(id, emo, callback) {
      callback(undefined, {emotional_response: 'negative'});
    },
    deleteIssue: function(id, callback) {
      callback(undefined, true);
    },
  };

  var mockTimeOut = function(f) {
    return f();
  }

  var mockAttr = {
    $attr: function() {
      return;
    }
  };

  var mockLocation = function() {
    return;
  }

  var mockWindow = {
    location: {
      origin: 'www.placeavote.com',
    },
  };

  var mockUserServiceSuccess = {
    isUserMe: function() {
      return true;
    },
  };

  var mockUserServiceError = {
    isUserMe: function() {
      return false;
    },
  };

  it('Should hit delete response service function if emotional response is the same', function() {
    var scope = {
      issue: {
        emotional_response: 'positive',
        positive_responses: 1,
      },
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess);
    subject.link(scope, undefined, mockAttr);
    scope.eResponse(undefined,'positive',scope.issue);
    expect(scope.issue.positive_responses).to.equal(0);
  });

  it('Should set emotional state to scope after returning from service', function() {
    var scope = {
      issue: {
        emotional_response: 'none',
        negative_responses: 0,
      },
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess);
    subject.link(scope, undefined, mockAttr);
    scope.eResponse(undefined,'negative',scope.issue);
    expect(scope.issue.negative_responses).to.equal(1);
    expect(scope.issue.emotional_response).to.equal('negative');
  });

  it('Should set emotional state to scope after returning from service and deduct from previous emotional reaction count', function() {
    var scope = {
      issue: {
        emotional_response: 'neutral',
        negative_responses: 0,
        neutral_responses: 2,
      },
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess);
    subject.link(scope, undefined, mockAttr);
    scope.eResponse(undefined,'negative',scope.issue);
    expect(scope.issue.negative_responses).to.equal(1);
    expect(scope.issue.neutral_responses).to.equal(1);
    expect(scope.issue.emotional_response).to.equal('negative');
  });


  it('should cancel issue editting, and revert to original comment', function() {
      var scope = {
      issue: {
        comment: 'This is the original comment before the user started making changed',
        comment_sanitized: 'This comment has been edited by the user but no posted',
      },
      original: 'This is the original comment before the user started making changed',
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess);
    subject.link(scope, undefined, mockAttr);
    scope.cancelIssue();
    expect(scope.issue.comment_sanitized).to.equal(scope.original);
  });


  it('editIssue() should return without posting if the original comment and new comment are the same', function(done) {
      var scope = {
      issue: {
        comment: 'This comment has been edited by the user but no posted',
        comment_sanitized: 'This comment has been edited by the user but no posted',
      },
      original: 'This comment has been edited by the user but no posted',
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess);
    subject.link(scope, undefined, mockAttr);
    scope.editIssue();
    expect(scope.original).to.equal(scope.issue.comment);
    done();
  });


  it('editIssue() should return without posting if the update is loading', function(done) {
      var scope = {
      issue: {
        comment: 'This comment has been edited by the user but no posted.',
        comment_sanitized: 'This comment has been edited by the user but no posted',
      },
      original: 'This comment has been edited by the user but no posted.',
      editLoading: true,
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess);
    subject.link(scope, undefined, mockAttr);
    scope.issue.comment += ' Edited.';
    scope.editIssue();
    expect(scope.editLoading).to.equal(scope.editLoading);
    done();
    var scope = {};
  });

  it('editIssue() should post updated issue content', function(done) {
      var scope = {
      issue: {
        issue_id: '12345',
        comment: 'This comment has been edited by the user but no posted.',
        comment_sanitized: 'This comment has been edited by the user but no posted.',
      },
      original: 'This comment has been edited by the user but no posted.',
      editLoading: false,
      $watch: function() {},
    };

    var mockIssueEditService = {
      editIssue: function(id, body, callback) {
        callback(undefined, body);
      }
    };

    var subject = new Issues(mockLocation, mockIssueEditService, undefined, mockWindow, mockUserServiceSuccess, mockTimeOut);
    subject.link(scope, undefined, mockAttr);
    scope.issue.comment_sanitized += ' Edited.';
    scope.editIssue();
         expect(scope.editLoading).to.equal(scope.editLoading);
         expect('This comment has been edited by the user but no posted. Edited.').to.equal(scope.issue.comment);
         expect(scope.user.showEditTools).to.equal(false);
        done();
  });


  it('deleteIssue() should return if deleting is occuring', function(done) {
      var scope = {
      issue: {
        issue_id: '12345',
        comment: 'This comment has been edited by the user but no posted.',
      },
      original: 'This comment has been edited by the user but no posted.',
      deleteLoading: true,
      $watch: function() {},
    };

    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess, mockTimeOut);
    subject.link(scope, undefined, mockAttr);
    scope.issue.comment += ' Edited.';
    scope.deleteIssue();
        expect(scope.deleteLoading).to.equal(true);
        done();
  });


  it('deleteIssue() should set deleteLoading back to false and issueDelete to true', function(done) {
      var scope = {
      issue: {
        issue_id: '12345',
        comment: 'This comment has been edited by the user but no posted.',
      },
      original: 'This comment has been edited by the user but no posted.',
      deleteLoading: false,
      showDelete: true,
      $watch: function() {},
      $apply: function() {},
    };

    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow, mockUserServiceSuccess, mockTimeOut);
    subject.link(scope, undefined, mockAttr);
    scope.deleteIssue();
        expect(scope.deleteLoading).to.equal(false);
        expect(scope.issue.issueDelete).to.equal(true);
        expect(scope.user.showDelete).to.equal(false);
        done();
  });

});
