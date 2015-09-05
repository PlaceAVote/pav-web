var RegisterController = require('../../js/Controllers/registerController.js');
var expect = require('chai').expect;

describe("RegisterController", function(){
	it("changes the state of selected to true, when calling select (initial state of selected is false)", function(){
		var subject = new RegisterController({}, {});
		expect(subject.selected).to.be.false;
		subject.select();
		expect(subject.selected).to.be.true;	
	});
	it("changes selected state to false, when was previously true", function(){
		var subject = new RegisterController({}, {});
		subject.selected = true;
		expect(subject.selected).to.be.true;
		subject.select();
		expect(subject.selected).to.be.false;
	});
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
