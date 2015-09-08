var SignUpController = require('../../src/controllers/sign_up_controller.js');
var expect = require('chai').expect;

describe("SignUpController", function(){
	it("has a user object", function(){
	var subject = new SignUpController();
	var blankUser = {
		first_name : "",
		last_name : "",
		dob : "",
		country_code : "840"
	};
	expect(subject.additionalInformation).to.eql(blankUser);
	});
});
