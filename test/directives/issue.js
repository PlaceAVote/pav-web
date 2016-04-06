var expect = require('chai').expect;
var Issues = require('../../src/directives/issue.js');

describe('Issue Directive', function() {

  var mockIssueService = {
    deleteIssueResponse: function(id, emo, callback) {
      callback(undefined, true);
    },
    setIssueResponse: function(id, emo, callback) {
      callback(undefined, {emotional_response: 'negative'});
    }
  };

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

  it('Should hit delete response service function if emotional response is the same', function() {
    var scope = {
      issue: {
        emotional_response: 'positive',
        positive_responses: 1,
      },
      $watch: function() {},
    };
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow);
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
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow);
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
    var subject = new Issues(mockLocation, mockIssueService, undefined, mockWindow);
    subject.link(scope, undefined, mockAttr);
    scope.eResponse(undefined,'negative',scope.issue);
    expect(scope.issue.negative_responses).to.equal(1);
    expect(scope.issue.neutral_responses).to.equal(1);
    expect(scope.issue.emotional_response).to.equal('negative');
  });

});
