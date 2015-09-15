var SignUpController = require('../../src/controllers/sign_up_controller.js');
var expect = require('chai').expect;

describe("SignUpController", function(){
	it("has a user object", function(){
	var subject = new SignUpController();
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
             
             };
        }
        var subject = new SignUpController(undefined, undefined, new mockUserService());
        subject.test();
     });
});
