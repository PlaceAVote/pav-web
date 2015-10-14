var BillService = require('../../src/services/bill_service.js');
var Bill = require('../../src/models/bill_summary.js');
var Comment = require('../../src/models/comment.js');
var AuthService = require("../../src/services/auth_service.js");

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
      var authService = new AuthService();
      var subject = new BillService({}, mockResource, authService);
      subject.getBill('100', function(err, result) {
      });
    });
    it('returns an error to the callback when resource raises error', function(done){
      function mockResource(url, params, method) {
        this.getById = function(body, onLoad, onError){
          onError('Error: A Server Error Occured');
        }
      }
      var authService = new AuthService();
      var subject = new BillService({}, mockResource, authService);
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
      var authService = new AuthService();
      var subject = new BillService({}, mockResource, authService);
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
        "total": 1,
        "comments": [
          {
            "author": "tony@pl.com",
            "bill_id": "hr2-114",
            "body": "comment 2 here",
            "has_children": true,
            "id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
            "parent_id": null,
            "replies": [
              {
                "author": "tony@pl.com",
                "bill_id": "hr2-114",
                "body": "Reply to comment 2",
                "has_children": false,
                "id": "comments:1e97cac2-30df-46f2-80c8-5ed4a36feb46",
                "parent_id": "comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626",
                "replies": [],
                "score": "2",
                "timestamp": "1444764060968",
              },
            ],
            "score": 100,
            "timestamp": 1444764009809,
          }
        ]
      };
      function mockResource(){
        this.getComments = function(object, onLoad, onError){
          onLoad(expected);
        }
      }
      var subject = new BillService(undefined, mockResource);
      subject.getTopComment('serverId', function(err, resource){
        expect(err).to.eql(undefined);
        console.log(resource);
        //expect(resource).to.eql(new Comment(expected.comments[0]));
        done();
      });
    });
    it('Returns an Error when server returns an error', function(done){
      function mockResource() {
        this.getComments = function(object, onLoad, onError){
          onError({message: 'Server Error'});
        }
      }
      var subject = new BillService({}, mockResource);
      subject.getTopComment('serverId', function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Server Error'});
        expect(resource).to.eql(undefined);
        done();
      });
    });
  });
});
