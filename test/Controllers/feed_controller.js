var FeedController = require('../../src/controllers/feed_controller.js');
var expect = require('chai').expect;
var User = require('../../src/models/user.js');

describe("FeedController", function() {
    // this.welcomeMessage = function() {

    // };
    function mockAuthService(){
      this.validateToken = function(callback) {
        return callback(true);
      }
    };
    function mockUserService(){
       this.getUser = function(){
           var user = new User("paul@test.com", "pas$WORD");
           user.first_name = "Paul";
           return user;
        }
        this.getUserProfile = function(id, callback) {
           var user = new User("paul@test.com", "pas$WORD");
           user.first_name = "Paul";
           return callback(undefined, user);
        }
    };
    function mockBillService(){
      this.getBills = function(username, callback){
        callback(undefined, []);
      };
      this.getTrends = function(callback) {
        callback(undefined, []);
      };
    };
    function mockTrendService(){
      this.getTrends = function(callback){
        callback(undefined, []);
      };
    };
    function mockFeedService(){
      this.getFeed = function(timestamp, callback){
        callback(undefined, []);
      };
    };
    function mockFeedServiceEvents() {
      this.getFeed = function(timestamp, callback) {
        var response = {
          last_timestamp: '1234',
          feed: ['events'],
        };
        callback(undefined, response);
      }
    };
    function mockFeedServiceEventsError() {
      this.getFeed = function(timestamp, callback) {
        var response = {
          last_timestamp: null,
          feed: ['events'],
        };
        callback(undefined, response);
      }
    };
    it("adds banner to scope", function(){
        var scope = {};
        var rootScope = {
          user: {
            newUser: true
          }
        };
        var subject = new FeedController(scope, {},new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedService(), rootScope);
        expect(!!scope.banner).to.eql(true);
    });
    it("getTrends returns trends array", function(done){
      var scope = {};
      var rootScope = {
          user: {
            newUser: true
          }
        };
      var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedService(), rootScope);
      subject.getTrends(function(err, response){
        expect(err).to.eql(undefined);
        expect(response).to.eql(true);
        done();
      });
      done();
    });
    it("getFeed returns feed array", function(done){
      var scope = {};
      var rootScope = {
          user: {
            newUser: true
          }
        };
      var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEvents(), rootScope);
      subject.getFeed();
      expect(subject.events).to.be.Array;
      done();
    });
    it("should return array with new timestamp", function(done) {
     var scope = {};
        var rootScope = {
            user: {
              newUser: true
            }
          };
        var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEvents(), rootScope);
        subject.lastLoaded = '1233';
        subject.feedCheck();
        expect(subject.events).to.be.an.array;
        expect(subject.lastLoaded).to.equal('1234');
        expect(subject.loadingScroll).to.equal.false
        done();
    });

    it("should cancel function if newTimestamp is the same of lastLoaded", function(done) {
     var scope = {};
        var rootScope = {
            user: {
              newUser: true
            }
          };
        var mockTimeOut = function() {
          return;
        }
        var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEvents(), rootScope, mockTimeOut);
        subject.lastLoaded = '1412';
        subject.newTimestamp = '1412';
        subject.scrollLoading = true;
        subject.feedCheck();
        expect(subject.lastLoaded).to.equal('1412');
        expect(subject.loadingScroll).to.equal.true
        done();
    });

    it("should return scroll Message if no more results are available", function(done) {
     var scope = {};
        var rootScope = {
            user: {
              newUser: true
            }
          };
        var mockTimeOut = function() {
          return;
        }
        var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), rootScope, mockTimeOut);
        subject.lastLoaded = '1412';
        subject.feedCheck();
        expect(subject.lastLoaded).to.equal('1412');
        expect(subject.scrollMessage).to.equal('.');
        done();
    });
});
