var Banner = require('../../src/models/banner.js');
var expect = require('chai').expect;
var User = require('../../src/models/user.js');

describe("Banner", function(){
    it("needs a user object", function(){
        var fn = function(){
        var banner = new Banner();
        }
        expect(fn).to.throw("Banner needs user");
    });
    it("generates specific welcome message for user", function(){
        var user = new User();
        user.first_name = "Paul";
        var banner = new Banner(user);
        expect(banner.welcome).to.eql("Hi Paul,");
    });
    it("has message", function(){
        var user = new User();
        var banner = new Banner(user);
        expect(banner.message).to.eql("Welcome to Placeavote. This is your feed page, the hive of activity for your political interests.");
    });
    it("has private privacy message when user profile is private", function(){
        var user = new User();
        var banner = new Banner(user);
        expect(banner.privacyMessage).to.eql("You have chosen to make your profile private");
    });
    it("has public privacy message when user profile is public", function(){
        var user = new User();
        user.private = true;
        var banner = new Banner(user);
        expect(banner.privacyMessage).to.eql("You have chosen to make your profile public");
    });
});
