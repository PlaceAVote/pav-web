var BillService = require('../../src/services/bill_service.js');
var TrendingBill = require('../../src/models/trending_bill.js');
var Bill = require('../../src/models/bill_summary.js');
var Comment = require('../../src/models/comment.js');
var AuthService = require('../../src/services/auth_service.js');
var mockLocal = require('../mocks/local_storage.js');
var authOptions = { window : {localStorage: new mockLocal() }};

var expect = require('chai').expect;
var resource = require("../../src/temp/mockBillResource.js");

describe("Bill Service", function(){
  describe('Get Bill', function(){
    it('Returns err to callback if id is not provided', function(done){
      var subject = new BillService();
      subject.getBill(undefined, function(err, result){
        expect(err).to.eql({message: "Error: No Id Provided"});
        expect(result).to.eql(undefined);
        done();
      });
    });
    it('creates resource with correct params', function(done){
      function mockResource(url, params, method) {
        expect(url).to.contain('/bills/100');
        expect(params).to.eql('100');
        expect(method.getById.method).to.eql('GET');
        this.getById = function(body, onLoad, onError){
        }
        done();
      }
      var authService = new AuthService(undefined, authOptions);
      var subject = new BillService(mockResource, authService);
      subject.getBill('100', function(err, result) {
      });
    });
    it('returns an error to the callback when resource raises error', function(done){
      function mockResource(url, params, method) {
        this.getById = function(body, onLoad, onError){
          onError('Error: A Server Error Occured');
        }
      }
      var authService = new AuthService(undefined, authOptions);
      var subject = new BillService(mockResource, authService);
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
      var authService = new AuthService(undefined, authOptions);
      var subject = new BillService(mockResource, authService);
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
      var authService = new AuthService(undefined, authOptions);
      var subject = new BillService(mockResource, authService);
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
        expect(url).to.contain('/bills/serverId/topcomments');
        expect(params).to.eql('serverId');
        expect(method.getComments.method).to.eql('GET');
        expect(method.getComments.headers['Authorization']).to.eql('TOKEN');
        done();
      }
      mockResource.prototype.getComments = function(object, onLoad, onError){
        onLoad(expected);
      }
      var authService = new AuthService(undefined, authOptions);
      authService.getAccessToken = function(){
        return 'TOKEN';
      };
      var subject = new BillService(mockResource, authService);
      subject.getTopComments('serverId', function(err, resource){
      });
    });
    it('Returns an Error when server returns an error', function(done){
      function mockResource() {
        this.getComments = function(object, onLoad, onError){
          onError({message: 'Server Error'});
        }
      }
      var authService = new AuthService(undefined, authOptions);
      var subject = new BillService(mockResource, authService);
      subject.getTopComments('serverId', function(err, resource){
        expect(err).to.not.eql(undefined);
        expect(err).to.eql({message: 'Server Error'});
        expect(resource).to.eql(undefined);
        done();
      });
    });
  });
  describe('Get Comments For Bill', function(done) {
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
        expect(url).to.contain('/bills/comments');
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
      var subject = new BillService(mockResource, authService, userService);
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
      var subject = new BillService(mockResource, authService, userService);
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
      var subject = new BillService(mockResource, authService, userService);
      subject.postComment('ID', 'HELLO DAMON!', function(err, resource){
        expect(err).to.eql(undefined);
        expect(resource).to.be.instanceOf(Comment);
        done();
      });
    });
  });
  describe('Get Trends', function() {
    it('returns error if auth token not present', function(done) {
      var mockAuthService = {
        getAccessToken: function() {},
      };
      var subject = new BillService(undefined, mockAuthService);
      subject.getTrends(function(err, result){
        expect(err.message).to.eql('No Auth Token');
        done();
      });
    });
    it('calls new resource with correct params', function(done) {
      function mockResource(url, params, method) {
        this.getTrends = function(){};
        expect(url).to.eql('https://apidev.placeavote.com/bills/trending');
        expect(params).to.eql(undefined);
        expect(method.getTrends.headers.Authorization).to.eql('HELLO');
        done();
      };
      var mockAuthService = {
        getAccessToken: function() {
          return 'HELLO';
        },
      };
      var subject = new BillService(mockResource, mockAuthService);
      subject.getTrends();
    });
    it('on server error returns error', function(done) {
      function mockResource(url, params, method) {
      };
      mockResource.prototype.getTrends = function(body, onLoad, onError) {
        onError('Server Error');
      };
      var mockAuthService = {
        getAccessToken: function() {
          return 'HELLO';
        },
      };
      var subject = new BillService(mockResource, mockAuthService);
      subject.getTrends(function(err, result) {
        expect(err).to.eql('Server Error');
        done();
      });
    });
    it('returns a list of sorted Trend Responses', function(done) {
      function mockResource(url, params, method) {
      };
      mockResource.prototype.getTrends = function(body, onLoad, onError) {
        onLoad(require('../fixtures/trending_bill_records'));
      };
      var mockAuthService = {
        getAccessToken: function() {
          return 'HELLO';
        },
      };
      var subject = new BillService(mockResource, mockAuthService);
      subject.getTrends(function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.length).to.eql(2);
        expect(result[0]).to.be.instanceof(TrendingBill);
        expect(result[1]).to.be.instanceof(TrendingBill);
        expect(result[2]).to.eql(undefined);
        done();
      });
    });
  });
  });
