var FeedController = require('../../src/controllers/feed_controller.js');
var expect = require('chai').expect;
var User = require('../../src/models/user.js');

describe("FeedController", function() {
    function mockSearchService(){
      this.bills = function(callback) {
        return callback();
      }
    };
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
    describe('get trends', function() {
      it('wont call service for discovery/trends', function() {
        var called = false;
        var mockSearchService = {
          bills: function(query, callback) {
            called = true;
            callback();
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('discovery', 'trends');
        expect(called).to.eql(false);
      });
      it('wont call for not discovery catergories', function() {
        var called = false;
        var mockSearchService = {
          bills: function(query, callback) {
            called = true;
            callback();
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('all', 'trends');
        expect(called).to.eql(false);
      });
      it('calls for discovery catergories', function() {
        var called = false;
        var mockSearchService = {
          bills: function(query, callback) {
            called = true;
            callback(undefined, [{comment_count: 3}, {comment_count: 5}]);
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('discovery', 'technology');
        expect(called).to.eql(true);
      });
      it('assigns selected sub category to selected category', function() {
        var called = false;
        var mockSearchService = {
          bills: function(query, callback) {
            called = true;
            callback(undefined, [{comment_count: 3}, {comment_count: 5}]);
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('discovery', 'technology');
        expect(called).to.eql(true);
        expect(subject.selectedCategory.name).to.eql('discovery');
        expect(subject.selectedCategory.selectedCategory.name).to.eql('technology');
      });

      it('wont call search service if the sub category is undefined', function() {
        var called = false;
        var mockSearchService = {
          bills: function(query, callback) {
            called = true;
            callback();
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('discovery', 'cats');
        expect(called).to.eql(false);
        expect(subject.selectedCategory.name).to.eql('discovery');
        expect(subject.selectedCategory.selectedCategory).to.eql(undefined);
      });

      it('pushes items from service onto categories items list', function() {
        var mockSearchService = {
          bills: function(query, callback) {
            callback(null, ['a', 'b', 'c']);
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('discovery', 'technology');
        expect(subject.selectedCategory.name).to.eql('discovery');
        expect(subject.selectedCategory.selectedCategory.items.length).to.eql(3);
      });
      it('does not update if service returns error', function() {
        var mockSearchService = {
          bills: function(query, callback) {
            callback(new Error('NOT TODAY'), null);
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
        subject.subCategoryClick('discovery', 'technology');
        expect(subject.selectedCategory.name).to.eql('discovery');
        expect(subject.selectedCategory.selectedCategory.items.length).to.eql(0);
      });
    });
    describe('Show Zip Model', function() {
      it('wont break if rootScope doesnt have user', function() {
         var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), {}, {}, mockSearchService);
         expect(subject.zipModal).to.eql(undefined);
         subject.showZipModal();
         expect(subject.zipModal).to.eql(undefined);
      });
      it('will show modal is district isnt on the user model', function() {
        var mockRS = {
          user: {
            state: 'CA',
          },
        };
        var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), mockRS, {}, mockSearchService);
       // Zip Modal is set on instantiation
       expect(subject.zipModal).to.eql(true);
     });
     it('will show modal is state isnt on the user model', function() {
       var mockRS = {
         user: {
           district: 6,
         },
       };
       var subject = new FeedController({}, {}, new mockUserService(), new mockBillService(), new mockAuthService(), new mockFeedServiceEventsError(), mockRS, {}, mockSearchService);
       // Zip Modal is set on instantiation
       expect(subject.zipModal).to.eql(true);
     });
   });
});
