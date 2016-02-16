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

  var mockResource = function(url, params, method) {
    this.getFeed = function(onLoad, onError) {
      onLoad({
        last_timestamp: '213123',
        results: [mockIssue, mockBill],
      });
    };
  };

  var mockResourceError = function(url, params, method) {
    this.getFeed = function(onLoad, onError) {
      onError('error');
    };
  };

  describe("Get Feed", function() {
    it('requires a token to get feed', function(done) {
      var subject = new FeedService(mockResource, mockAuthWithoutToken);
      subject.getFeed(undefined, function(err, result) {
        expect(err).to.eql('Token is needed to get feed');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      var subject = new FeedService(mockResource, mockAuth);
      subject.getFeed('1231253252', function(err, result) {
        expect(err).to.be.string;
      });
      done();
    });

    it('returns an error from the server', function(done) {
      var subject = new FeedService(mockResourceError, mockAuth);
      subject.getFeed(undefined,function(err, res) {
        expect(err).to.eql('error');
        done();
      });
    });

    it('returns array of BillSummary and Issue if server response successfully', function(done) {
      var subject = new FeedService(mockResource, mockAuth);
      subject.getFeed('23423423', function(err, result) {
        console.log('from feed service');
        console.log(err, result.feed.length);
        expect(result.feed.length).to.eql(2);
        expect(result.feed[1]).to.be.an.instanceof(BillSummary);
        expect(result.feed[0]).to.be.an.instanceof(Issue);
        done();
      });
    });
  });
});
