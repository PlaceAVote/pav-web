var User = require("../../src/models/user.js");
var expect = require("chai").expect;

describe("Users", function(){
    it("has default private property equal false", function(){
        var user = new User();
        expect(user.private).to.eql(false);
    });
    it("sets email and password when supplied", function(){
        var user = new User("paul", "TEST123");
        expect(user.email).to.eql("paul");
        expect(user.password).to.eql("TEST123");
    });
    it("toBody returns an object with a password if an auth token isn't supplied", function(){
        var user = new User("paul@test.com", "test0606");
        user.dob = new Date("04/01/1990");
        user.img_url = "image.com";
        user.first_name = "paul";
        user.last_name = "barber";
        user.country_code = "USA";
        var subject = user.toBody();
        var expected = {
            country_code: "USA",
            first_name: "paul",
            last_name: "barber",
            img_url: "image.com",
            dob: new Date("04/01/1990"),
            email: "paul@test.com",
            password: "test0606",
            topics: []
        };
        expect(subject).to.eql(expected);
    });
    it("toBody doesn't return password, but returns auth if authentication is used", function(){
        var user = new User("paul@test.com", "test0606");
        user.dob = new Date("04/01/1990");
        user.img_url = "image.com";
        user.first_name = "paul";
        user.last_name = "barber";
        user.country_code = "USA";
        var subject = user.toBody("auth_token");
        var expected = {
            country_code: "USA",
            first_name: "paul",
            last_name: "barber",
            img_url: "image.com",
            dob: new Date("04/01/1990"),
            email: "paul@test.com",
            token: "auth_token",
            topics: []
        };
        expect(subject).to.eql(expected);
    });
});
