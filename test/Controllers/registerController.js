var RegisterController = require('../../js/Controllers/registerController.js');
var expect = require('chai').expect;

describe("RegisterController", function(){
	it("go function calls location.path", function(){
		var called, args;
		var location = {
			path : function(hash){
				called = true;
				args = hash;
			}
		}
		var subject = new RegisterController({}, location);
		subject.go('test');
		expect(called).to.be.true;
		expect(args).to.eql('test');
	});
	it("should have a list of topics", function(){
		var subject = new RegisterController({}, {});
		expect(!!subject.interests).to.be.true;
	});
});
