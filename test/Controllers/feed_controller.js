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
    it("adds banner to scope", function(){
        var scope = {};
        var subject = new FeedController(scope, {},new mockUserService(), {getBills : function(){}});
        expect(!!scope.banner).to.eql(true);
    });
});
