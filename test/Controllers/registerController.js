var RegisterController = require('../../js/Controllers/registerController.js');
var Interest = require('../../js/Models/interest.js');
var expect = require('chai').expect;

describe("RegisterController", function() {
	it("go function calls location.path", function() {
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
	it("has a list of topics", function() {
		var subject = new RegisterController({}, {});
		expect(!!subject.interests).to.be.true;
	});
	describe("Select", function(){
		it("selects the correct interest based upon name", function() {
			var subject = new RegisterController({},{});
			subject.interests = [new Interest('test', '.test')];
			expect(subject.getInterest('test').name).to.eql('test');		
		}); 	
		it("returns undefined if interest can't be found", function() {
			var subject = new RegisterController({},{});
			expect(!!subject.getInterest('test')).to.be.false;
		}); 
		it("calls select on the selected interest", function() {
			var called = false;
			var subject = new RegisterController({});
			subject.interests = [new Interest('test', '.test')];
			subject.interests[0].select = function(){
				called = true;
			}
			subject.select('test');
			expect(called).to.be.true;
		});
		it("doesn't call select if getInterest returns undefined", function() {
			var called = false;
			var subject = new RegisterController({});
			subject.interests = [new Interest('test', '.test')];
			subject.interests[0].select = function(){
				called = true;
			}
			subject.select('cat');
			expect(called).to.be.false;
		});
	});
});
