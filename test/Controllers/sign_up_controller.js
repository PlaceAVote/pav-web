var SignUpController = require('../../src/controllers/sign_up_controller.js');
var expect = require('chai').expect;

describe("SignUpController", function(){
    function mockUserService() {
        this.getUser = function() {
            return {
                name : "paul"
            }
        };
    }
	it("has a user object", function(){
    var mockUS = new mockUserService();
	var subject = new SignUpController(undefined, undefined, mockUS);
	var blankUser = {
		first_name : "",
		last_name : "",
		dob : "",
		country_code : "USA"
	};
	expect(subject.additionalInformation).to.eql(blankUser);
	});
    it("when service returns error, set scope.error to be true", function(done){
        function mockUserService() {
             this.saveUser = function(callback){
                callback("Server returned error");
                expect(subject.error).to.eql(true);
                done();
             };
             this.addAdditionalInformation = function() {
             
             };
             this.getUser = function() {
                return {
                    name : "paul"
                }
             };
        }
        var mockUS = new mockUserService();
        var subject = new SignUpController(undefined, undefined, mockUS);
        subject.test();
     });
    it("prepopulates user data from service if user data is found", function() {
        function mockUserService() {
            var that = this;
            that.user = {
                first_name: "paul",
                last_name:"barber",
                email:"test@test.com",
                dob: new Date("04/01/1990")
            };
            that.getUser = function() {
                return that.user;
            };
        }
        var mockUS = new mockUserService();
        var subject = new SignUpController(undefined, undefined, mockUS);
        expect(subject.additionalInformation.first_name).to.eql("paul");
        expect(subject.additionalInformation.last_name).to.eql("barber");
        expect(subject.additionalInformation.dob).to.eql(new Date("04/01/1990"));
    });
});
