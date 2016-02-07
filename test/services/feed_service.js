var expect = require('chai').expect;
var FeedService = require('../../src/services/feed_service.js');
var BillSummary = require('../../src/models/bill_summary.js');
var Issue = require('../../src/models/issue.js');

describe("Feed Service", function() {
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
    type: "userissue",
  };

  var mockBill = {
    bill_id: "hr2-114",
    type: "bill",
  };

  describe("Get Feed", function() {
    it('requires a token to get feed', function(done) {
      var subject = new FeedService({}, mockAuthWithoutToken);
      subject.getFeed(function(err, result) {
        expect(err).to.eql('Token is needed to get feed');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      function mockResource(url, params, method) {
        this.getFeed = function(){};
        expect(url).to.contain('/user/feed');
        expect(params).to.eql(undefined);
        expect(method.getFeed.headers.Authorization).to.eql('Token');
        expect(method.getFeed.method).to.eql('GET');
        done();
      }
      var subject = new FeedService(mockResource, mockAuth);
      subject.getFeed(function(err, result) {
        expect(err).to.eql(undefined);
      });
    });

    it('returns an error from the server', function(done) {
      function mockResource(url, params, method) {
        this.getFeed = function(body, onLoad, onError) {
          expect(body).to.eql(undefined);
          onError('Error');
        };
      }
      var subject = new FeedService(mockResource, mockAuth);
      subject.getFeed(function(err) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('returns array of BillSummary and Issue if server response successfully', function(done) {
      function mockResource(url, params, method) {
        this.getFeed = function(body, onLoad, onError) {
          var result = {
            results: [
              mockBill,
              mockIssue
            ]
          };
          return onLoad(result);
        };

      }
      var subject = new FeedService(mockResource, mockAuth);
      subject.getFeed(function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.feed.length).to.eql(2);
        expect(result.feed[0]).to.be.an.instanceof(BillSummary);
        expect(result.feed[1]).to.be.an.instanceof(Issue);
        done();
      });
    });

  });
});
