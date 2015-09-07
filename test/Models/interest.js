var Interest = require("../../src/models/interest.js");
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
	it("changes the state of selected to true, when calling select (initial state of selected is false)", function(){
                var subject = new Interest();
                expect(subject.selected).to.be.false;
                subject.select();
                expect(subject.selected).to.be.true;
        });
        it("changes selected state to false, when was previously true", function(){
                var subject = new Interest();
                subject.selected = true;
                expect(subject.selected).to.be.true;
                subject.select();
                expect(subject.selected).to.be.false;
        });
})
