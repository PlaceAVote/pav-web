var BillService = require('../../src/services/bill_service.js');
var Bill = require('../../src/models/bill_summary.js');
var Comment = require('../../src/models/comment.js');
var AuthService = require('../../src/services/auth_service.js');
var mockLocal = require('../mocks/local_storage.js');
var authOptions = { window : {localStorage: new mockLocal() }};

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
        expect(url).to.eql('http://pav-congress-api-515379972.us-east-1.elb.amazonaws.com:8080/bills/100');
        expect(params).to.eql('100');
        expect(method.getById.method).to.eql('GET');
        this.getById = function(body, onLoad, onError){
        }
        done();
      }
      var authService = new AuthService(authOptions);
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
      var authService = new AuthService(authOptions);
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
      var authService = new AuthService(authOptions);
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
      subject.getTopComments(undefined, function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Id Must Be Defined'});
        done();
      });
    });
    it('Gets top Comments from the server', function(done){
      var expected = require('../fixtures/top_comments.js');
      function mockResource(){
        this.getComments = function(object, onLoad, onError){
          onLoad(expected);
        }
      }
      var authService = new AuthService(authOptions);
      var subject = new BillService(undefined, mockResource, authService);
      subject.getTopComments('serverId', function(err, resource){
        expect(err).to.eql(undefined);
        expect(resource.forComment).to.eql(new Comment(expected['for-comment']));
        expect(resource.againstComment).to.eql(new Comment(expected['against-comment']));
        done();
      });
    });
    it('checks params of top comments', function(done) {
      var expected = require('../fixtures/top_comments.js');
      function mockResource(url, params, method){
        expect(url).to.eql('http://pav-congress-api-515379972.us-east-1.elb.amazonaws.com:8080/bills/serverId/topcomments');
        expect(params).to.eql('serverId');
        expect(method.getComments.method).to.eql('GET');
        expect(method.getComments.headers['Authorization']).to.eql('TOKEN');
        done();
      }
      mockResource.prototype.getComments = function(object, onLoad, onError){
        onLoad(expected);
      }
      var authService = new AuthService(authOptions);
      authService.getAccessToken = function(){
        return 'TOKEN';
      };
      var subject = new BillService(undefined, mockResource, authService);
      subject.getTopComments('serverId', function(err, resource){
      });
    });
    it('Returns an Error when server returns an error', function(done){
      function mockResource() {
        this.getComments = function(object, onLoad, onError){
          onError({message: 'Server Error'});
        }
      }
      var authService = new AuthService(authOptions);
      var subject = new BillService(undefined, mockResource, authService);
      subject.getTopComments('serverId', function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Server Error'});
        expect(resource).to.eql(undefined);
        done();
      });
    });
  });
  describe('Get Comments For Bill', function(done) {
    it('returns an error if bill id is undefined', function(done){
      var mockResource = require('../../src/temp/mockBillResource.js');
      var subject = new BillService(mockResource);
      subject.getComments(undefined, undefined, function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Id Must Be Defined'});
        done();
      });
    });
    it('Calls Resource with correct params', function(done) {
      var expected = require('../fixtures/comments.js');
      function mockResource(url, params, method){
        expect(url).to.eql('http://pav-congress-api-515379972.us-east-1.elb.amazonaws.com:8080/bills/serverId/comments?from=0');
        expect(params).to.eql(undefined);
        expect(method.getComments.method).to.eql('GET');
        expect(method.getComments.headers['Authorization']).to.eql('TOKEN');
        done();
      }
      mockResource.prototype.getComments = function(object, onLoad, onError){
      }
      var authService = new AuthService(authOptions);
      authService.getAccessToken = function(){
        return 'TOKEN';
      };
      var subject = new BillService(undefined, mockResource, authService);
      subject.getComments('serverId', undefined, function(err, resource){
      });
    });
    it('Calls get Comment and returns error', function(done) {
      var expected = require('../fixtures/comments.js');
      function mockResource(url, params, method){
      }
      mockResource.prototype.getComments = function(object, onLoad, onError){
        onError('ERROR');
      }
      var authService = new AuthService(authOptions);
      authService.getAccessToken = function(){
        return 'TOKEN';
      };
      var subject = new BillService(undefined, mockResource, authService);
      subject.getComments('serverId', undefined, function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql('ERROR');
        done();
      });
    });
    it('Returns a List of Comments', function(done) {
      var expected = require('../fixtures/comments.js');
      function mockResource(url, params, method){
      }
      mockResource.prototype.getComments = function(object, onLoad, onError){
        onLoad(expected);
      }
      var authService = new AuthService(authOptions);
      authService.getAccessToken = function(){
        return 'TOKEN';
      };
      var subject = new BillService(undefined, mockResource, authService);
      subject.getComments('serverId', undefined, function(err, resource){
        expect(err).to.eql(undefined);
        expect(resource.length).to.eql(1);
        expect(resource[0].author).to.eql('tony@pl.com');
        expect(resource[0].replies[0].parent_id).to.eql('comments:9e9b0180-c5ab-4806-a8b5-ee37b9867626');
        done();
      });
    });
    it('returns an error if bill id is undefined', function(done) {
      var mockResource = require('../../src/temp/mockBillResource.js');
      var subject = new BillService(mockResource);
      subject.postComment(undefined, undefined, function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Bill Id is required to post a comment on a bill'});
        done();
      });
    });
  });
  describe('Post Comment', function(){
    it('returns an error if bill id is undefined', function(done) {
      var mockResource = require('../../src/temp/mockBillResource.js');
      var subject = new BillService(mockResource);
      subject.postComment('ID', undefined, function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'A Comment is required to post'});
        done();
      });
    });
    it('calls resource with the correct params', function(done) {
      function mockResource(url, params, method){
        expect(url).to.eql('http://pav-congress-api-515379972.us-east-1.elb.amazonaws.com:8080/bills/comments');
        expect(params).to.eql(undefined);
        expect(method.postComment.method).to.eql('PUT');
        expect(method.postComment.headers['Authorization']).to.eql('TOKEN');
        done();
      }
      mockResource.prototype.postComment = function(object, onLoad, onError){
      }
      authService = {
        getAccessToken: function() {
          return "TOKEN";
        },
      }
      userService = {
        getUser: function() {
          return {
            email: 'paul@test.com',
          };
        },
      };
      var subject = new BillService(undefined, mockResource, authService, userService);
      subject.postComment('ID', 'HELLO DAMON!', function(err, resource){
      });
    });
    it('calls postComment and returns error', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.postComment = function(object, onLoad, onError){
        onError('Error');
      }
      authService = {
        getAccessToken: function() {
          return "TOKEN";
        },
      }
      userService = {
        getUser: function() {
          return {
            email: 'paul@test.com',
          };
        },
      };
      var subject = new BillService(undefined, mockResource, authService, userService);
      subject.postComment('ID', 'HELLO DAMON!', function(err, resource){
        expect(err).to.eql('Error');
        done();
      });
    });
    it('calls postComment and returns new comment', function(done) {
      var comment =  {bill_id: 'ID', body: 'HELLO DAMON!'};
      function mockResource(url, params, method){
      }
      mockResource.prototype.postComment = function(object, onLoad, onError){
        expect(object).to.eql(comment);
        onLoad('Error');
      }
      authService = {
        getAccessToken: function() {
          return "TOKEN";
        },
      };
      var subject = new BillService(undefined, mockResource, authService, userService);
      subject.postComment('ID', 'HELLO DAMON!', function(err, resource){
        expect(err).to.eql(undefined);
        expect(resource).to.be.instanceOf(Comment);
        done();
      });
    });
  });
});
