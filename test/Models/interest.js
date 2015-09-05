var Interest = require("../../js/Models/interest.js");
var expect = require("chai").expect;

describe("Interest", function(){
	it("Should have a name", function(){
		var subject = new Interest('Guns');
		expect(subject.name).to.eql('Guns');	
	});
	it("Should have a icon", function(){
		var subject = new Interest(undefined, '.gun');
		expect(subject.icon).to.eql('.gun');
	});
	it("Should by defult should be unselected", function(){
		var subject = new Interest();
		expect(subject.selected).to.eql(false);	
	});

});
