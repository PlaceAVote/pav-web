var expect = require('chai').expect;
var BillSummary = require('../../src/models/bill_summary.js');
var Issue = require('../../src/models/issue.js');
var FeedResponseFactory = require('../../src/factories/feed_response_factory.js');

var mockIssue = {
  bill_id: "hr2-114",
  type: "userissue",
};

var mockBill = {
  bill_id: "hr2-114",
  type: "bill",
};

describe('Single Response', function(){
  it('throws error if no type is defined', function(){
    var fn = function() {
      var result = FeedResponseFactory.getResponse();
    }
    expect(fn).to.throw({message:'No Type Defined'});
  });

  it('returns a Bill for Bill type', function(){
    var result = FeedResponseFactory.getResponse(mockBill);
    expect(result).to.be.an.instanceof(BillSummary);
    expect(result.bill_id).to.eql('hr2-114');
  });

  it('returns a Issue for User Issue type', function(){
    var result = FeedResponseFactory.getResponse(mockIssue);
    expect(result).to.be.an.instanceof(Issue);
    expect(result.bill_id).to.eql('hr2-114');
  });

  it('throws error when default', function(){
    var fn = function() {
      var result = FeedResponseFactory.getResponse({type: 'cat'});
    }
    expect(fn).to.throw({message:'Type Not Supported'});
  });
});

describe('Multiple Responses', function() {
  it('returns an array of the same length', function(){
    var responses = [mockBill, mockIssue];
    var results = FeedResponseFactory.getResponses(responses);
    expect(results.length).to.eql(2);
  });
});

