var UserService = require("../../src/services/user_service.js");
var Interest = require("../../src/models/interest.js");

var expect = require("chai").expect;

describe("User Service", function() {
	describe("Create User", function(){
		it("creates a User Object", function(){
			var subject = new UserService();
			expect(subject.user).to.eql(undefined);
			subject.createUser("test@email.com", "p4SSw0rD!");
			expect(subject.user.username).to.eql("test@email.com");	
			expect(subject.user.password).to.eql("p4SSw0rD!");
		});
	});
	describe("Get User", function(){
		it("returns undefined if a user hasn't been created", function(){
			var subject = new UserService();
			var user = subject.getUser();
			expect(user).to.eql(undefined);	
		});
		it("returns the services instantiated user", function(){
			var subject = new UserService();
			subject.createUser("test@email.com", "p4SSw0rD!");
			expect(subject.getUser().username).to.eql("test@email.com");	
			expect(subject.getUser().password).to.eql("p4SSw0rD!");
		});
	});
	describe("Add Interests", function(){
		it("adds interests to the user object", function(){
			var subject = new UserService();
			subject.createUser("test@email.com", "p4SSw0rD!");
			var interests = [new Interest("test", ".test-icon")];
			subject.addInterests(interests);
			var user = subject.getUser();
			expect(user.interests).to.eql(interests);	
		});
		it("returns undefined if user isn't created", function(){
			var subject = new UserService();
			var interests = [new Interest("test", ".test-icon")];
			subject.addInterests(interests);
			var user = subject.getUser();
			expect(user).to.eql(undefined);	
		});

	});	
	describe("Add additional information", function(){
		it("returns undefined if user isn't created", function(){
			var subject = new UserService();
			var additonalInformation = {
				first_name : "paul",
				last_name : "barber",
				dob : "04/01/1990",
				country_code: "804"
			}
			subject.addAdditionalInformation(additonalInformation);
			var user = subject.getUser();
			expect(user).to.eql(undefined);	
		});
		it("adds DOB, Name, And Language to the user object", function(){
			var subject = new UserService();
			subject.createUser("test@email.com", "p4SSw0rD!");
			var additionalInformation = {
				first_name : "paul",
				last_name : "barber",
				dob : "04/01/1990",
				country_code: "804"
			};
			subject.addAdditionalInformation(additionalInformation);
			var user = subject.getUser();
			expect(user.first_name).to.eql("paul");	
			expect(user.last_name).to.eql("barber");	
			expect(user.dob).to.eql("04/01/1990");	
			expect(user.country_code).to.eql("804");	
		});
	});	
});
