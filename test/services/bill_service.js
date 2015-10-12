var BillService = require('../../src/services/bill_service.js');
var Bill = require('../../src/models/bill_summary.js');
var Comment = require('../../src/models/comment.js');

var expect = require('chai').expect;
var resource = require("../../src/temp/mockBillResource.js");

describe("Bill Service", function(){
  describe('GetBills', function(){
    it("Returns a list of bills", function(done){
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
              "type": "bill",
              "subject": "Guns",
              "bill_id": "gu1-123",
              "total_comments": "80",
              "short_title": "Shooting people for the sake of it",
              "votes": {
                "yes": 100,
                "no": 78
              }
            }
          ]);
        }
      };
      var subject = new BillService(mockResource);
      var results = subject.getBills("user", function(err, result){
        expect(err).to.eql(undefined);
        expect(result.length).to.eql(2);
        expect(result[0] instanceof Bill).to.eql(true);
        expect(result[1] instanceof Bill).to.eql(true);
        done();
      });
    });
    it("Returns an error", function(done){
      var mockResource = {
        get: function(object, onLoad, onError){
          onError({message:"Error"});
        }
      };
      var subject = new BillService(mockResource);
      subject.getBills("user", function(err, result){
        expect(err).to.eql({message: "Error"});
        expect(result).to.eql(undefined);
        done();
      });
    });
  });
  describe('Get Bill', function(){
    it('Returns err to callback if id is not provided', function(done){
      var subject = new BillService({});
      subject.getBill(undefined, function(err, result){
        expect(err).to.eql({message: "Error: No Id Provided"});
        expect(result).to.eql(undefined);
        done();
      });
    });
    it('creates resource with correct params', function(done){
      function mockResource(url, params, method) {
        expect(url).to.eql('http://pav-congress-api-196217309.us-west-2.elb.amazonaws.com:8080/bills/100');
        expect(params).to.eql('100');
        expect(method.getById.method).to.eql('GET');
        this.getById = function(body, onLoad, onError){
        }
        done();
      }
      var subject = new BillService({}, mockResource);
      subject.getBill('100', function(err, result) {
      });
    });
    it('returns an error to the callback when resource raises error', function(done){
      function mockResource(url, params, method) {
        this.getById = function(body, onLoad, onError){
          onError('Error: A Server Error Occured');
        }
      }
      var subject = new BillService({}, mockResource);
      subject.getBill('100', function(err, result) {
        expect('Error: A Server Error Occured');
        expect(result).to.eql(undefined);
        done();
      });
    });
    it('returns a (full) Bill data model', function(done){
      var data = require('../fixtures/bill.js');
      function mockResource(url, params, method) {
        this.getById = function(body, onLoad, onError){
          onLoad(data);
        }
      }
      var subject = new BillService({}, mockResource);
      subject.getBill('100', function(err, result) {
        expect(undefined);
        expect(result).to.not.eql(undefined);
        expect(result.billData).to.eql(data);
        done();
      });
    });
  });
  describe('Get Top Comment', function(){
    it('returns an error if bill id is undefined', function(done){
      var mockResource = require('../../src/temp/mockBillResource.js');
      var subject = new BillService(mockResource);
      subject.getTopComment(undefined, function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Id Must Be Defined'});
        done();
      });
    });
    it('Returns a comment from the server', function(done){
      var expected = {
        "type": "comment",
        "user_name": "Paul Barber",
        "comment": "this is a comment blah ablah blash",
        "replies": 80,
        "subject": "Guns",
        "upvotes": 100,
      };
      var mockResource = {
        getTopComment: function(object, onLoad, onError){
          onLoad(expected);
        }
      };
      var subject = new BillService(mockResource);
      subject.getTopComment('serverId', function(err, resource){
        expect(err).to.eql(undefined);
        expect(resource).to.eql(new Comment(expected));
        done();
      });
    });
    it('Returns an Error when server returns an error', function(done){
      var mockResource = {
        getTopComment: function(object, onLoad, onError){
          onError({message: 'Server Error'});
        }
      };
      var subject = new BillService(mockResource);
      subject.getTopComment('serverId', function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Server Error'});
        expect(resource).to.eql(undefined);
        done();
      });
    });
  });
});
