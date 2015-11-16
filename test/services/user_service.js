var UserService = require("../../src/services/user_service.js");
var Interest = require("../../src/models/interest.js");
var strftime = require("strftime");
var expect = require("chai").expect;
var AuthService = require("../../src/services/auth_service.js");
var mockLocal = require('../mocks/local_storage.js');
var authOptions = { window: {localStorage: new mockLocal() }};

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
        country_code: "USA"
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
        dob : new Date(),
        country_code: "USA"
      };
      subject.addAdditionalInformation(additionalInformation);
      var user = subject.getUser();
      expect(user.first_name).to.eql("paul");
      expect(user.last_name).to.eql("barber");
      expect(user.dob).to.eql(strftime('%m/%d/%Y', new Date()));
      expect(user.country_code).to.eql("USA");
    });
  });
  describe("Save User", function() {
    it("returns undefined if user isn't defined", function(){
      var subject = new UserService();
      expect(subject.saveUser()).to.be.undefined;
    });
    it("passes resource correct user", function(done){
      function mockResource(url, params, methods, options) {
        this.create = function(user, succeed, error){
          expect(user.first_name).to.eql('paul');
          expect(user.last_name).to.eql('barber');
          expect(user.dob).to.eql(strftime('%m/%d/%Y', new Date()));
          expect(user.country_code).to.eql('804');
          done();
        };
      }
      authService = new AuthService(authOptions);
      var subject = new UserService(mockResource, undefined, authService);
      subject.createUser("test@email.com", "p4SSw0rD!");
      var additionalInformation = {
        first_name : "paul",
        last_name : "barber",
        dob : new Date(),
        country_code: "804"
      };
      subject.addAdditionalInformation(additionalInformation);
      subject.saveUser();
    });
    it("returns user to callback when there's no error", function(done){
      function mockResource(url, params, methods, options) {
        this.create = function(user, succeed, error){
          succeed(user);
        };
      };
      authService = new AuthService(authOptions);
      var subject = new UserService(mockResource, undefined, authService);
      subject.createUser("test@email.com", "p4SSw0rD!");
      var additionalInformation = {
        first_name : "paul",
        last_name : "barber",
        dob : new Date(),
        country_code: "804"
      };
      subject.addAdditionalInformation(additionalInformation);
      subject.saveUser(function(err, user){
        expect(err).to.be.undefined;
        expect(user.first_name).to.eql('paul');
        expect(user.last_name).to.eql('barber');
        expect(user.dob).to.eql(strftime('%m/%d/%Y', new Date()));
        expect(user.country_code).to.eql('804');
        done();
      });
    });
    it("returns error to callback when service fails", function(done){
      function mockResource(url, params, methods, options) {
        this.create = function(user, succeed, error){
          error("Create User Failed");
        };
      };
      var authService = new AuthService(authOptions);
      var subject = new UserService(mockResource, undefined, authService);
      subject.createUser("test@email.com", "p4SSw0rD!");
      var additionalInformation = {
        first_name : "paul",
        last_name : "barber",
        dob : new Date(),
        country_code: "804"
      };
      subject.addAdditionalInformation(additionalInformation);
      subject.saveUser(function(err, user){
        expect(err).to.eql("Create User Failed");
        done();
      });
    });
    it("login returns callback with a invalid password error", function(done){
      var subject = new UserService();
      var callback = function(err, result) {
        expect(err.message).to.eql("User has no password or username");
        done();
      };
      var user = {
        password: 'P4ssWORD'
      }
      subject.login(user, callback);
    });
    it("calls resource with valid user", function(done) {
      function mockResource(url, params, methods, options) {
        this.login = function(user, succeed, error){
          expect(user.email).to.eql('paul');
          expect(user.password).to.eql('TEST555');
          done();
        };
      };
      var authService = new AuthService(authOptions);
      var subject = new UserService(mockResource, undefined, authService);
      subject.login({
        email: 'paul',
        password: 'TEST555'
      });
    });
    it("calls callback with no error when user has logged in", function(done) {
      function mockResource(url, params, methods, options) {
        this.login = function(user, succeed, error){
          succeed({token : '000001', first_name: 'paul'});
        };
      };
      var authService = new AuthService(authOptions);
      var subject = new UserService(mockResource, undefined, authService);
      subject.login({email: 'paul', password: 'passWO3rd'}, function(err, resource) {
        expect(err).to.eql(undefined);
        expect(!!resource).to.eql(true);
        done();
      });
    });
    it("calls back with error if server returns an error", function(done) {
      function mockResource(url, params, methods, options) {
        this.login = function(user, succeed, error){
          error({message: 'Server Error'});
        };
      };
      var authService = new AuthService(authOptions);
      var subject = new UserService(mockResource, undefined, authService);
      subject.login({email: 'paul', password: 'passWO3rd'}, function(err, resource) {
        expect(err).to.eql({message: 'Server Error'});
        expect(!!resource).to.eql(false);
        done();
      });
    });
  });
  describe("Facebook integration", function(){
    function MockFacebook() {
      this.login = function(callback){
        var mockResource = {
          email: "test@test.com",
          birthday: "04/01/1990",
          first_name: "paul",
          last_name: "barber",
          picture: {
            data: {
              url: "img.com"
            }
          }
        };
        var auth = {
          accessToken:  "authT0k3n4000"
        };
        callback(mockResource, auth);
      };
    };
    it("calls facebook resource with correct user details", function(done){
      function mockResource(url, params, methods, options) {
        this.methods = methods;
        this.login = function(user, succeed, error){
          expect(user.email).to.eql("test@test.com");
          expect(methods.login.headers["Authorization"]).to.eql("authT0k3n4000");
          done();
        };
      };
      mockFacebook = new MockFacebook();
      authService = new AuthService(authOptions);
      authService.setAuth({accessToken: 'TOKEN'});
      var subject = new UserService(mockResource, mockFacebook, authService);
      subject.loginWithFacebook(function(err, result){});

    });
    it("returns a User Not Defined Error when trying to log in to a user that has not yet created an account", function(done){
      function mockResource(url, params, methods, options) {
        this.login = function(user, succeed, error){
          error({message: "User Not Found"});
          done();
        };
      };
      facebook = new MockFacebook();
      authService = new AuthService(authOptions);
      authService.setAuth({accessToken: 'TOKEN'});
      var subject = new UserService(mockResource, mockFacebook, authService);
      subject.loginWithFacebook(function(err, resource){
        expect(err.message).to.eql("User Not Found");
        expect(resource.first_name).to.eql("paul");
      });
    });
    it("onError sets created via facebook bool", function(done){
      function mockResource(url, params, methods, options) {
        this.login = function(data, onLoad, onError){
          onError({message: "User Not Found"});
        }
      };
      facebook = new MockFacebook();
      authService = new AuthService(authOptions);
      authService.setAuth({accessToken: 'TOKEN'});
      var subject = new UserService(mockResource, mockFacebook, authService);
      subject.loginWithFacebook(function(err, resource){
        expect(subject.createdFB).to.eql(true);
        done();
      });
    });
    it("create from facebook should only have specific params", function(done){
      mockResource = function(){
        this.create = function(data, onLoad, onError){
          expect(data.email).to.eql("test@email.com");
          expect(data.password).to.eql(undefined);
          expect(data.first_name).to.eql("paul");
          expect(data.last_name).to.eql("barber");
          expect(!!data.dob).to.eql(true);
          expect(data.country_code).to.eql("804");
          expect(data.topics[0]).to.eql('guns');
          expect(data.img_url).to.eql('img.com');
          done();
        };
      };
      facebook = new MockFacebook();
      authService = new AuthService(authOptions);
      authService.setFacebookAuth({accessToken: 'hello'});
      var subject = new UserService(mockResource, facebook, authService);
      subject.createUser("test@email.com", "p4SSw0rD!");
      var additionalInformation = {
        first_name : "paul",
        last_name : "barber",
        country_code: "804"
      };
      subject.user.topics = [{name:'guns'}];
      subject.user.img_url = 'img.com';
      subject.user.dob = new Date('04/01/1990');
      subject.addAdditionalInformation(additionalInformation);
      subject.createdFB = true;
      subject.userToken = {
        accessToken: "AUTHT0k3n"
      };
      subject.saveUser();
    });
    describe("User public perception", function(){
      it("can be changed to be public", function(){
        mockResource = function(){};
        facebook = new MockFacebook();
        var subject = new UserService();
        subject.createUser("paul@test.com", "PASwo4rd");
        subject.makeProfilePublic();
        expect(subject.user.private).to.eql(true);
        subject.makeProfilePublic();
        expect(subject.user.private).to.eql(false);
      });
    });
  });
  describe('Get User Profile', function() {
    var authService = {
      getAccessToken: function() {
        return 'PAV_AUTH_TOKEN CHOUNDFLKAND:ND'
      }
    };
    it('returns error if user has no access token', function(done) {
      var auth = {
        getAccessToken: function() {
          return undefined;
        }
      };
      var subject = new UserService(undefined, undefined, auth);
      subject.getUserProfile(function(err, result) {
        expect(err.status).to.eql(401);
        expect(err.message).to.eql('No Auth Token');
        expect(result).to.eql(undefined);
        done();
      });
    });
    it('calls get resource with correct params', function(done) {
      function mockResource(url, params, method, options) {
        this.getProfile = function(){};
        expect(url).to.eql('http://pav-user-api-924234322.us-east-1.elb.amazonaws.com:8080/user/me/profile');
        expect(params).to.eql(undefined);
        expect(method.getProfile.headers['Authorization']).to.eql('PAV_AUTH_TOKEN CHOUNDFLKAND:ND');
        expect(method.getProfile.method).to.eql('GET');
        done();
      };
      var subject = new UserService(mockResource, undefined, authService);
      subject.getUserProfile(function(err, result) {
      });
    });
    it('returns an error from server', function(done) {
      function mockResource() {
      }
      mockResource.prototype.getProfile = function(body, onLoad, onError){
          return onError({status: 401});
      }
      var subject = new UserService(mockResource, undefined, authService);
      subject.getUserProfile(function(err, result) {
        expect(err).to.eql({status:401});
        done();
      });
    });
    it('returns user from server', function(done) {
      var user = {email: 'test@test.com', first_name: 'Paul', last_name: 'Barber', dob: '04/01/1990', country_code: '', topics: ['Arts']};
      function mockResource() {
      }
      mockResource.prototype.getProfile = function(body, onLoad, onError){
          return onLoad(user);
      }
      var subject = new UserService(mockResource, undefined, authService);
      subject.getUserProfile(function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.email).to.eql(user.email);
        expect(result.loadedFromServer).to.eql(true);
        done();
      });
    });
    it('doesnt call server if user is defined and was loaded from server', function(done) {
      var serverCalls = 0;
      function mockResource() {
      }
      mockResource.prototype.getProfile = function(body, onLoad, onError){
        serverCalls++;
        onLoad(user);
      }
      var subject = new UserService(mockResource, undefined, authService);
      subject.user = {loadedFromServer: true};
      subject.getUserProfile(function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.loadedFromServer).to.eql(true);
        expect(serverCalls).to.eql(0);
        done();
      });
    });
  });
});

