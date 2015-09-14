var UserService = require("../../src/services/user_service.js");
var Interest = require("../../src/models/interest.js");

var expect = require("chai").expect;

describe("User Service", function() {
	describe("Create User", function(){
		it("creates a User Object", function(){
			var subject = new UserService();
			expect(subject.user).to.eql(undefined);
			subject.createUser("test@email.com", "p4SSw0rD!");
			expect(subject.user.email).to.eql("test@email.com");	
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
			expect(subject.getUser().email).to.eql("test@email.com");	
			expect(subject.getUser().password).to.eql("p4SSw0rD!");
		});
	});
	describe("Add Topics", function(){
		it("adds interests to the user object", function(){
			var subject = new UserService();
			subject.createUser("test@email.com", "p4SSw0rD!");
			var interests = [new Interest("test", ".test-icon")];
			subject.addTopics(interests);
			var user = subject.getUser();
			expect(user.topics).to.eql(interests);	
		});
		it("returns undefined if user isn't created", function(){
			var subject = new UserService();
			var interests = [new Interest("test", ".test-icon")];
			subject.addTopics(interests);
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
    describe("Save User", function() {
        it("returns undefined if user isn't defined", function(){
            var subject = new UserService();
            expect(subject.saveUser()).to.be.undefined;
        });
        it("passes resource correct instantiation params to query", function(done){
            function mockResource(url, params, methods, options) {
                expect(url).to.eql('http://192.168.99.100:8080/user/');
                expect(params).to.be.undefined;
                expect(methods.create).to.eql({method : 'PUT'});
                expect(options).to.be.undefined;
                this.create = function(){

                };
                done();
            }
            var subject = new UserService(mockResource);
            subject.createUser("test@email.com", "p4SSw0rD!");
            subject.saveUser();
        });
        it("passes resource correct user", function(done){
            function mockResource(url, params, methods, options) {
                expect(url).to.eql('http://192.168.99.100:8080/user/');
                expect(params).to.be.undefined;
                expect(methods.create).to.eql({method : 'PUT'});
                expect(options).to.be.undefined;
                this.create = function(user, succeed, error){
                    expect(user.first_name).to.eql('paul');
                    expect(user.last_name).to.eql('barber');
                    expect(user.dob).to.eql('04/01/1990');
                    expect(user.country_code).to.eql('804');
                    done();
                };
            }
            var subject = new UserService(mockResource);
            subject.createUser("test@email.com", "p4SSw0rD!");
			var additionalInformation = {
				first_name : "paul",
				last_name : "barber",
				dob : "04/01/1990",
				country_code: "804"
			};
			subject.addAdditionalInformation(additionalInformation);
            subject.saveUser();
        });
        it("returns user to callback when there's no error", function(done){
           function mockResource(url, params, methods, options) {
              expect(url).to.eql('http://192.168.99.100:8080/user/');
              expect(params).to.be.undefined;
              expect(methods.create).to.eql({method : 'PUT'});
              expect(options).to.be.undefined;
              this.create = function(user, succeed, error){
                succeed(user);                
              };
            };
            var subject = new UserService(mockResource);
            subject.createUser("test@email.com", "p4SSw0rD!");
			var additionalInformation = {
				first_name : "paul",
				last_name : "barber",
				dob : "04/01/1990",
				country_code: "804"
			};
			subject.addAdditionalInformation(additionalInformation);
            subject.saveUser(function(err, user){
                expect(err).to.be.undefined;
                expect(user.first_name).to.eql('paul');
                expect(user.last_name).to.eql('barber');
                expect(user.dob).to.eql('04/01/1990');
                expect(user.country_code).to.eql('804');
                done();
            });
        });
        it("returns error to callback when service fails", function(done){
           function mockResource(url, params, methods, options) {
              expect(url).to.eql('http://192.168.99.100:8080/user/');
              expect(params).to.be.undefined;
              expect(methods.create).to.eql({method : 'PUT'});
              expect(options).to.be.undefined;
              this.create = function(user, succeed, error){
                 error("Create User Failed");                
              };
            };
            var subject = new UserService(mockResource);
            subject.createUser("test@email.com", "p4SSw0rD!");
			var additionalInformation = {
				first_name : "paul",
				last_name : "barber",
				dob : "04/01/1990",
				country_code: "804"
			};
			subject.addAdditionalInformation(additionalInformation);
            subject.saveUser(function(err, user){
                expect(err).to.eql("Create User Failed");
                done();
            });
        });

    });
});
