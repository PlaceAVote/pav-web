var expect = require('chai').expect;
var VotesService = require('../../src/services/votes_service.js');
var CurrentVote = require('../../src/models/current_vote.js');
var User = require('../../src/models/user.js');

describe('Vote Service', function(){
  var authService = {
    getAccessToken: function(){
      return 'TOKEN';
    }
  };
  describe('Get Votes for Bill', function(){
    it('returns err to callback is id is not defined', function(done) {
      var subject = new VotesService();
      subject.getVotesForBill(undefined, function(err, resource) {
        expect(err).to.eql({message: 'Bill Id not specified'});
        done();
      });
    });
    it('calls resource with correct params', function(done) {
      function mockResource(url, params, method){
        expect(url).to.eql('http://pav-vote-api-143877429.us-east-1.elb.amazonaws.com:8080/vote/count?bill-id=hr2-114');
        expect(params).to.eql('hr2-114');
        expect(method.getForBill.headers['Authorization']).to.eql('TOKEN');
        expect(method.getForBill.method).to.eql('GET');
        done();
      }
      mockResource.prototype.getForBill = function(object, onLoad, onError) {
      };

      var subject = new VotesService(mockResource, authService);
      subject.getVotesForBill('hr2-114', function(err, resource) {
      });
    });
    it('calls callback with error if server returns error', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.getForBill = function(object, onLoad, onError) {
        expect(object).to.eql(undefined);
        return onError({message: 'Server Error'});
      };
      var subject = new VotesService(mockResource, authService);
      subject.getVotesForBill('hr2-114', function(err, resource) {
        expect(err.message).to.eql('Server Error');
        expect(resource).to.eql(undefined);
        done();
      });
    });
    it('calls callback with data from server', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.getForBill = function(object, onLoad, onError) {
        expect(object).to.eql(undefined);
        var data = {
          'bill-id': 'hr2-114',
          'yes-count': 100,
          'no-count': 180,
        };
        return onLoad(data);
      };
      var subject = new VotesService(mockResource, authService);
      subject.getVotesForBill('hr2-114', function(err, resource) {
        expect(err).to.eql(undefined);
        expect(resource).to.be.instanceof(CurrentVote);
        expect(resource.id).to.eql('hr2-114');
        expect(resource.yes).to.eql(100);
        expect(resource.no).to.eql(180);
        done();
      });
    });
    it('returns an error if bill id is not specified', function(done){
      var subject = new VotesService();
      subject.voteOnBill(undefined, false, function(err, resource) {
        expect(err).to.eql({message: 'Bill Id not specified'});
        done();
      });
    });
    it('returns an error if vote type (for/against) is not defined', function(done){
      var subject = new VotesService();
      subject.voteOnBill('hr-241', undefined, function(err, resource) {
        expect(err).to.eql({message: 'No Vote Cast'});
        done();
      });
    });
    it('calls resource with correct params', function(done) {
      function mockResource(url, params, method){
        expect(url).to.eql('http://pav-vote-api-143877429.us-east-1.elb.amazonaws.com:8080/vote');
        expect(params).to.eql(undefined);
        expect(method.voteOnBill.headers['Authorization']).to.eql('TOKEN');
        expect(method.voteOnBill.method).to.eql('PUT');
        done();
      }
      mockResource.prototype.voteOnBill = function(object, onLoad, onError) {
      };
      var userService = {
        getUser: function(){
          var user = new User();
          user.email = "paul@testing.com";
          return user;
        }
      }
      var subject = new VotesService(mockResource, authService, userService);
      subject.voteOnBill('hr2-114', false, function(err, resource) {
      });
    });
    it('calls voteOnBill resource with corret params', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.voteOnBill = function(object, onLoad, onError) {
        expect(object.vote).to.eql(true);
        done();
      };
      var userService = {
        getUser: function(){
          var user = new User();
          user.email = "paul@testing.com";
          return user;
        }
      }
      var subject = new VotesService(mockResource, authService, userService);
      subject.voteOnBill('hr2-114', true, function(err, resource) {
      });
    });
    it('returns error in callback from server side error', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.voteOnBill = function(object, onLoad, onError) {
        onError({message: 'Error'});
      };
      var userService = {
        getUser: function(){
          var user = new User();
          user.email = "paul@testing.com";
          return user;
        }
      }
      var subject = new VotesService(mockResource, authService, userService);
      subject.voteOnBill('hr2-114', true, function(err, resource) {
        expect(err).to.not.eql(undefined);
        expect(resource).to.eql(undefined);
        done();
      });
    });
    it('returns resource when successfully voted', function(done) {
      function mockResource(url, params, method){
      }
      mockResource.prototype.voteOnBill = function(object, onLoad, onError) {
        onLoad({message: 'Error'});
      };
      var userService = {
        getUser: function(){
          var user = new User();
          user.email = "paul@testing.com";
          return user;
        }
      }
      var subject = new VotesService(mockResource, authService, userService);
      subject.voteOnBill('hr2-114', true, function(err, resource) {
        expect(err).to.eql(undefined);
        expect(resource).to.eql(true);
        done();
      });
    });
  });
});
