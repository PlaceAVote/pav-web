var TrendService = require('../../src/services/trend_service.js');
var expect = require('chai').expect;
var Bill = require('../../src/models/bill.js');
var Comment = require("../../src/models/comment.js");

describe("Trend Service", function(){
  it("Returns a list of trends", function(done){
    var mockResource = {
      get : function(object, onLoad, onError) {
        onLoad([
          {
            "type": "bill",
            "subject": "Health",
            "bill_id": "hr2-114",
            "total_comments": "34",
            "short_title": "Medicare Access and CHIP Reauthorization Act of 2015",
            "votes": {
              "yes": 2,
              "no": 50
            }
          },
          {
            "type": "comment",
            "user_name": "Paul Barber",
            "comment": "this is a comment blah ablah blash",
            "replies": 80,
            "subject": "Guns",
            "upvotes": 100,
          }
        ]);
      }
    };
    var subject = new TrendService(mockResource);
    subject.getTrends(function(err,result){
      expect(err).to.eql(undefined);
      expect(result.length).to.eql(2);
      expect(result[0] instanceof Bill).to.eql(true);
      expect(result[1] instanceof Comment).to.eql(true);
      done();
    });
  });
  it("Returns an error", function(done){
    var mockResource = {
      get: function(object, onLoad, onError){
        onError({message:"Error"});
      }
    };
    var subject = new TrendService(mockResource);
    subject.getTrends(function(err, result){
      expect(err).to.eql({message: "Error"});
      expect(result).to.eql(undefined);
      done();
    });
  });
});
