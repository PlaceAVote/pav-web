var FeedController = require('../../src/controllers/feed_controller.js');
var expect = require('chai').expect;
var User = require('../../src/models/user.js');

describe("FeedController", function() {
    function mockUserService(){
       this.getUser = function(){
           var user = new User("paul@test.com", "pas$WORD");
           user.first_name = "Paul";
           return user;
        }
    };
    function mockBillService(){
      this.getBills = function(username, callback){
        callback(undefined, []);
      };
    };
    function mockTrendService(){
      this.getTrends = function(callback){
        callback(undefined, []);
      };
    };
    it("adds banner to scope", function(){
        var scope = {};
        var subject = new FeedController(scope, {},new mockUserService(), new mockBillService(), new mockTrendService());
        expect(!!scope.banner).to.eql(true);
    });
    it("getTrends returns trends array", function(done){
      var scope = {};
      var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockTrendService());
      subject.getTrends(function(err, response){
        expect(err).to.eql(undefined);
        expect(!!response).to.eql(true);
        done();
      });
    });
    it("getBills returns bills array", function(done){
      var scope = {};
      var subject = new FeedController(scope, {}, new mockUserService(), new mockBillService(), new mockTrendService());
      subject.getBills("user", function(err, response){
        expect(err).to.eql(undefined);
        expect(!!response).to.eql(true);
        done();
      });
    });
});

