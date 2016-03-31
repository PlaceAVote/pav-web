var RegisterController = require('../../src/controllers/register_controller.js');
var Interest = require('../../src/models/interest.js');
var expect = require('chai').expect;

describe("RegisterController", function() {
	it("go function calls location.path", function() {
		var called, args, added;
		var location = {
			path : function(hash){
				called = true;
				args = hash;
			}
		};
		var userService = {
			addTopics : function(interests) {
				added = true;
			}
		};
		var subject = new RegisterController({}, location, userService, {});
		subject.go('test');
		expect(called).to.be.true;
		expect(added).to.be.true;
		expect(args).to.eql('test');
	});
	it("has a list of topics", function() {
		var subject = new RegisterController({}, {}, {}, {});
		expect(!!subject.interests).to.be.true;
	});
	describe("Select", function(){
		it("selects the correct interest based upon name", function() {
			var subject = new RegisterController({}, {}, {}, {});
			subject.interests = [new Interest('test', '.test')];
			expect(subject.getInterest('test').name).to.eql('test');
		});
		it("returns undefined if interest can't be found", function() {
			var subject = new RegisterController({}, {}, {}, {});
			expect(!!subject.getInterest('test')).to.be.false;
		});
		it("calls select on the selected interest", function() {
			var called = false;
			var subject = new RegisterController({}, {}, {}, {});
			subject.interests = [new Interest('test', '.test')];
			subject.interests[0].select = function(){
				called = true;
			}
			subject.select('test');
			expect(called).to.be.true;
		});
		it("doesn't call select if getInterest returns undefined", function() {
			var called = false;
			var subject = new RegisterController({}, {}, {}, {});
			subject.interests = [new Interest('test', '.test')];
			subject.interests[0].select = function(){
				called = true;
			}
			subject.select('cat');
			expect(called).to.be.false;
		});
	});
	describe("Get Selected", function(){
		it("returns a list of selected interests", function(){
			var subject = new RegisterController({}, {}, {}, {});
			subject.select('Healthcare');
			subject.select('Drugs');
			var interest = subject.getSelected();
			expect(interest.length).to.eql(2);
			expect(interest[0].name).to.eql('Drugs');
			expect(interest[1].name).to.eql('Healthcare');
		});
	});
});
