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
        user.gender = "male";
        user.zipcode = 1234;
        var subject = user.toBody();
        var expected = {
            first_name: "paul",
            last_name: "barber",
            zipcode: 1234,
            img_url: "image.com",
            dob: new Date("04/01/1990"),
            email: "paul@test.com",
            password: "test0606",
            gender: "male",
            topics: []
        };
        expect(subject).to.eql(expected);
    });
    it("toBody returns an object with a password if an auth token isn't supplied", function(){
        var user = new User("PAUL@TEST.COM", "test0606");
        user.dob = new Date("04/01/1990");
        user.img_url = "image.com";
        user.first_name = "paul";
        user.last_name = "barber";
        user.gender = "male";
        user.zipcode = 1234;
        var subject = user.toBody();
        var expected = {
            first_name: "paul",
            last_name: "barber",
            zipcode: 1234,
            img_url: "image.com",
            dob: new Date("04/01/1990"),
            email: "paul@test.com",
            password: "test0606",
            gender: "male",
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
        user.facebookId = "test id";
        user.facebookToken = "test token";
        user.zipcode = 1234;
        user.gender = "male";
        var subject = user.toBody("auth_token", "01010101");
        var expected = {
            zipcode: 1234,
            first_name: "paul",
            last_name: "barber",
            img_url: "image.com",
            dob: new Date("04/01/1990"),
            email: "paul@test.com",
            token: "test token",
            gender: "male",
            id: "test id",
            topics: []
        };
        expect(subject).to.eql(expected);
    });
});
