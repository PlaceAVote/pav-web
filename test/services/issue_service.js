var expect = require('chai').expect;
var IssueService = require('../../src/services/issue_service.js');
var Issue = require('../../src/models/issue.js');

describe("Issue Service", function() {
  var mockAuthWithoutToken = {
    getAccessToken: function() {
      return;
    },
  };

  var mockAuth = {
    getAccessToken: function() {
      return 'Token';
    },
  };

  var mockIssue = {
    bill_id: "hr2-114",
    comment: "Comment Body goes here",
  };

  describe("Save Issue", function() {
    it('returns an error if no issue is given', function(done) {
      var subject = new IssueService({}, {});
      subject.saveIssue(undefined, function(err) {
        expect(err).to.eql('Issue is required');
        done();
      });
    });

    it('requires a token to save a issue', function(done) {
      var subject = new IssueService({}, mockAuthWithoutToken);
      subject.saveIssue(true, function(err, result) {
        expect(err).to.eql('Token is needed to save a issue');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      function mockResource(url, params, method) {
        this.save = function(){};
        expect(url).to.contain('/user/issue');
        expect(params).to.eql(undefined);
        expect(method.save.headers.Authorization).to.eql('Token');
        expect(method.save.method).to.eql('PUT');
        done();
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.saveIssue(true, function(err, result) {
        expect(err).to.eql(undefined);
      });
    });

    it('returns an error from the server', function(done) {
      function mockResource(url, params, method) {
        this.save = function(body, onLoad, onError) {
          expect(body).to.eql(mockIssue);
          onError('Error');
        };
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.saveIssue(mockIssue, function(err) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('returns no error when succesful put', function(done) {
      function mockResource(url, params, method) {
        this.save = function(body, onLoad, onError) {
          expect(body).to.eql(mockIssue);
          onLoad();
        };
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.saveIssue(mockIssue, function(err) {
        expect(err).to.eql(undefined);
        done();
      });
    });
  });

  var mockIssueId = '010101';
  var mockResponseValue = 1;

  describe("Set Issue Response", function() {
    it('returns an error if issue id or response value is not given', function(done) {
      var subject = new IssueService({}, {});
      subject.setIssueResponse(undefined, undefined, function(err) {
        expect(err).to.eql('Issue id and response value is required');
        done();
      });
    });

    it('requires a token to response', function(done) {
      var subject = new IssueService({}, mockAuthWithoutToken);
      subject.setIssueResponse(mockIssueId, mockResponseValue, function(err, result) {
        expect(err).to.eql('Token is needed to set issue response');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      function mockResource(url, params, method) {
        this.setResponse = function(){};
        expect(url).to.contain('/user/issue/' + mockIssueId + '/response');
        expect(params).to.eql(undefined);
        expect(method.setResponse.headers.Authorization).to.eql('Token');
        expect(method.setResponse.method).to.eql('POST');
        done();
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.setIssueResponse(mockIssueId, mockResponseValue, function(err, result) {
        expect(err).to.eql(undefined);
      });
    });

    it('returns an error from the server', function(done) {
      function mockResource(url, params, method) {
        this.setResponse = function(body, onLoad, onError){
          expect(body.emotional_response).to.eql(mockResponseValue);
          onError('Error');
        };
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.setIssueResponse(mockIssueId, mockResponseValue, function(err, result) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('returns no error when succesful put', function(done) {
      function mockResource(url, params, method) {
        this.setResponse = function(body, onLoad, onError) {
          onLoad(body);
        };
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.setIssueResponse(mockIssueId, mockResponseValue, function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.emotional_response).to.eql(mockResponseValue);
        done();
      });
    });
  });

  describe("Get Issue Response", function() {
    it('returns an error if issue id is not given', function(done) {
      var subject = new IssueService({}, {});
      subject.getIssueResponse(undefined, function(err) {
        expect(err).to.eql('Issue id is required');
        done();
      });
    });

    it('requires a token to get response value', function(done) {
      var subject = new IssueService({}, mockAuthWithoutToken);
      subject.getIssueResponse(mockIssueId, function(err, result) {
        expect(err).to.eql('Token is needed to get issue response');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      function mockResource(url, params, method) {
        this.getResponse = function(){};
        expect(url).to.contain('/user/issue/' + mockIssueId + '/response');
        expect(params).to.eql(undefined);
        expect(method.getResponse.headers.Authorization).to.eql('Token');
        expect(method.getResponse.method).to.eql('GET');
        done();
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.getIssueResponse(mockIssueId, function(err, result) {
        expect(err).to.eql(undefined);
      });
    });

    it('returns an error from the server', function(done) {
      function mockResource(url, params, method) {
        this.getResponse = function(body, onLoad, onError) {
          expect(body).to.eql(undefined);
          onError('Error');
        };
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.getIssueResponse(mockIssueId, function(err, result) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('returns no error when succesful put', function(done) {
      function mockResource(url, params, method) {
        this.getResponse = function(body, onLoad, onError) {
          expect(body).to.eql(undefined);
          var toBody = {
            emotional_response: mockResponseValue,
          };
          onLoad(toBody);
        };
      }
      var subject = new IssueService(mockResource, mockAuth);
      subject.getIssueResponse(mockIssueId, function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.emotional_response).to.eql(mockResponseValue);
        done();
      });
    });
  });
});
