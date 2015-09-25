var User = require("../../src/models/user.js");
var expect = require("chai").expect;

describe("Users", function(){
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
            image: "image.com",
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
            image: "image.com",
            dob: new Date("04/01/1990"),
            email: "paul@test.com",
            token: "auth_token",
            topics: []
        };
        expect(subject).to.eql(expected);
    });
});
