var UserService = require("../../src/services/user_service.js");
var Interest = require("../../src/models/interest.js");
var strftime = require("strftime");
var expect = require("chai").expect;
var AuthService = require("../../src/services/auth_service.js");
var mockLocal = require('../mocks/local_storage.js');
var authOptions = { window: {localStorage: new mockLocal() }};
var User = require('../../src/models/user.js');

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
    it("returns undefined if user isn't defined", function() {
      var subject = new UserService(undefined, undefined, undefined);
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
      var authService = new AuthService(undefined, authOptions);
      authService.getAccessToken = function(){return "Hello"};
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
      var authService = new AuthService(undefined, authOptions);
      authService.getAccessToken = function(){return "Hello"};
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
      var authService = new AuthService(undefined, authOptions);
      authService.getAccessToken = function(){return "Hello"};
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
      var subject = new UserService(undefined, undefined, undefined);
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
      // var authService = new AuthService(undefined, authOptions);
      // authService.getAccessToken = function(){return "Hello"};
      var subject = new UserService(mockResource, undefined, undefined);
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
      var authService = new AuthService(undefined, authOptions);
      authService.getAccessToken = function(){return "Hello"};
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
      var authService = new AuthService(undefined, authOptions);
      authService.getAccessToken = function() {
        return "HELLO!";
      };
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
      authService = new AuthService(undefined, authOptions);
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
      authService = new AuthService(undefined, authOptions);
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
      authService = new AuthService(undefined, authOptions);
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
      authService = new AuthService(undefined, authOptions);
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
      subject.getUserProfile('id', function(err, result) {
        expect(err.status).to.eql(401);
        expect(err.message).to.eql('No Auth Token');
        expect(result).to.eql(undefined);
        done();
      });
    });
    it('calls get resource with correct params', function(done) {
      function mockResource(url, params, method, options) {
        this.getProfile = function(){};
        expect(url).to.contain('/user/me/profile');
        expect(params).to.eql(undefined);
        expect(method.getProfile.headers['Authorization']).to.eql('PAV_AUTH_TOKEN CHOUNDFLKAND:ND');
        expect(method.getProfile.method).to.eql('GET');
        done();
      };
      var subject = new UserService(mockResource, undefined, authService);
      subject.getUserProfile('me', function(err, result) {
      });
    });
    it('returns an error from server', function(done) {
      function mockResource() {
      }
      mockResource.prototype.getProfile = function(body, onLoad, onError){
          return onError({status: 401});
      }
      var subject = new UserService(mockResource, undefined, authService);
      subject.getUserProfile('id', function(err, result) {
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
      subject.getUserProfile('id', function(err, result) {
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
      subject.getUserProfile('id', function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.loadedFromServer).to.eql(true);
        expect(serverCalls).to.eql(0);
        done();
      });
    });
  });
  describe('Get a specified users profile', function() {
    it('returns an error with status 401 if the authToken is not  defined', function(done) {
      var authService = {
        getAccessToken: function() {}
      };
      var subject = new UserService(undefined, undefined, authService);
      var id = 301;
      subject.getUserFromId(id, function(err, result) {
        expect(err.status).to.eql(401);
        done();
      });
    });
    it('returns an error if no id is present in request', function(done) {
    var subject = new UserService(undefined, undefined, authService);
    subject.getUserFromId(undefined, function(err, result) {
      expect(err.message).to.eql('Must Supply User Id');
      done();
    });
    });
    it('passes the right info to resource constructor', function(done) {
      function mres(url, params, method, options){
        this.getProfile = function(){};
        expect(url).to.contain('/user/203hr3r3/profile');
        expect(params).to.eql(undefined);
        expect(method.getProfile.headers['Authorization']).to.eql('PAV_AUTH_TOKEN CHOUNDFLKAND:ND');
        expect(method.getProfile.method).to.eql('GET');
        done();
      }
      var subject = new UserService(mres, undefined, authService);
      var userId = '203hr3r3';
      subject.getUserFromId(userId, function(err, result){});
    });
    it('returns error from server', function(done) {
      function mres(){
        this.getProfile = function(params, onLoad, onError){
          expect(params).to.eql(undefined);
          onError({status:401, message: 'Not Auth'});
        }
      }
      var subject = new UserService(mres, undefined, authService);
      var userId = '203hr3r3';
      subject.getUserFromId(userId, function(err, result){
        expect(err).to.eql({status:401, message: 'Not Auth'});
        done();
      });
    });
    it('returns a user from server', function(done) {
      var user = {
        email: 'test@test.com',
        first_name: 'paul',
        last_name: 'barber',
        dob: '04/01/1990',
        country_code: 'USA',
        topics: ['GUNS'],
        following: true,
        total_followers:102,
        total_following:480,
      };
      function mres(){
        this.getProfile = function(params, onLoad, onError){
          expect(params).to.eql(undefined);
          onLoad(user);
        }
      }
      var subject = new UserService(mres, undefined, authService);
      var userId = '203hr3r3';
      subject.getUserFromId(userId, function(err, result){
        expect(err).to.eql(undefined);
        expect(result).to.eql(User.createFromJson(user));
        done();
      });
    });
  });
  describe('UserProfile Timeline', function() {
    it('returns error if no id is supplied', function(done) {
      var authService = {
        getAccessToken: function() {
          return "***";
        },
      };
      var subject = new UserService(undefined, undefined, authService);
      subject.getUserTimeline(undefined, function(err, result){
        expect(err.message).to.eql('Id is required');
        done();
      });
    });
    it('passes correct params to resource', function(done) {
      function userResource(url, params, method) {
        expect(url).to.contain('/user/me/timeline');
        expect(params).to.eql(undefined);
        expect(method.getTimeline.headers['Authorization']).to.eql('PAV_AUTH_TOKEN 000001');
        this.getTimeline = function(){};
        done();
      }

      authService = {
        getAccessToken: function() {
          return 'PAV_AUTH_TOKEN 000001';
        },
      };

      var subject = new UserService(userResource, undefined, authService);
      subject.getUserTimeline('me', function(err, response){});
    });
    it('returns an error from server', function(done) {
      function userResource(url, params, method) {
        this.getTimeline = function(params, onLoad, onError){
          return onError('Error');
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getUserTimeline('me', function(err, response){
        expect(err.message).to.eql('Server Error');
        expect(response).to.eql(undefined);
        done();
      });
    });
    it('returns an array of the same length as returned from server', function(done) {
      function userResource(url, params, method) {
        this.getTimeline = function(params, onLoad, onError){
          var r = {results: [
            {
              type: 'comment'
            },
            {
              type: 'dislikecomment'
            },
            {
              type: 'likecomment'
            }
          ]}
          r['next-page'] = 1;
          return onLoad(r);
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getUserTimeline('me', function(err, response){
        expect(err).to.eql(undefined);
        expect(response.next_page).to.eql(1);
        expect(response.timeline.length).to.eql(3);
        done();
      });
    });
    it('returns onError when factory fails', function(done) {
      function userResource(url, params, method) {
        this.getTimeline = function(params, onLoad, onError){
          var r = {results: [
            {
              type: 'comment'
            },
            {
              type: 'cat'
            },
          ]}
          r['next-page'] = 1;
          return onLoad(r);
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getUserTimeline('me', function(err, response){
        expect(err.message).to.eql('Type Not Supported');
        done();
      });
    });
  });
  describe('User Followers', function() {
    it('returns error if no id is supplied', function(done) {
      authService = {
        getAccessToken: function() {
          return 'PAV_AUTH_TOKEN 000001';
        },
      };
      var subject = new UserService(undefined, undefined, authService);
      subject.getFollowers(undefined, function(err, result){
        expect(err.message).to.eql('Id is required');
        done();
      });
    });
    it('passes correct params to resource', function(done) {
      function userResource(url, params, method) {
        expect(url).to.contain('/user/me/followers');
        expect(params).to.eql(undefined);
        expect(method.getFollowers.headers['Authorization']).to.eql('PAV_AUTH_TOKEN 000001');
        this.getFollowers = function(){};
        done();
      }
      authService = {
        getAccessToken: function() {
          return 'PAV_AUTH_TOKEN 000001';
        },
      };
      var subject = new UserService(userResource, undefined, authService);
      subject.getFollowers('me', function(err, response){});
    });
    it('returns an error from server', function(done) {
      function userResource(url, params, method) {
        this.getFollowers = function(params, onLoad, onError){
          return onError('Error');
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getFollowers('me', function(err, response){
        expect(err.message).to.eql('Server Error');
        expect(response).to.eql(undefined);
        done();
      });
    });
    it('returns a list of users from the server', function(done){
      function userResource(url, params, method) {
        this.getFollowers = function(params, onLoad, onError){
          var users = [
            {
              user_id: '1',
              first_name: 'paul',
              last_name: 'barber',
              img_ur: 'catmeme'
            },
            {
              user_id: '2',
              first_name: 'anth',
              last_name: 'oneil',
              img_ur: 'cutedogpic'
            },
          ];
          return onLoad(users);
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getFollowers('me', function(err, response){
        expect(err).to.eql(undefined);
        expect(response.length).to.eql(2);
        expect(response[0].user_id).to.eql('1');
        done();
      });
    });
  });
  describe('User Following', function() {
    it('returns error if no id is supplied', function(done) {
      var access = {
        getAccessToken: function() {
          return "hello";
        },
      };
      var subject = new UserService(undefined, undefined, access);
      subject.getFollowing(undefined, function(err, result){
        expect(err.message).to.eql('Id is required');
        done();
      });
    });
    it('passes correct params to resource', function(done) {
      function userResource(url, params, method) {
        expect(url).to.contain('/user/007/following');
        expect(params).to.eql(undefined);
        expect(method.getFollowing.headers['Authorization']).to.eql('PAV_AUTH_TOKEN 000001');
        this.getFollowing = function(){};
        done();
      }
      authService.getAccessToken = function(){return 'PAV_AUTH_TOKEN 000001'};
      var subject = new UserService(userResource, undefined, authService);
      subject.getFollowing('007', function(err, response){});
    });
    it('returns an error from server', function(done) {
      function userResource(url, params, method) {
        this.getFollowing = function(params, onLoad, onError){
          return onError('Error');
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getFollowing('me', function(err, response){
        expect(err.message).to.eql('Server Error');
        expect(response).to.eql(undefined);
        done();
      });
    });
    it('returns a list of users from the server', function(done){
      function userResource(url, params, method) {
        this.getFollowing = function(params, onLoad, onError){
          var users = [
            {
              user_id: '1',
              first_name: 'paul',
              last_name: 'barber',
              img_ur: 'catmeme'
            },
            {
              user_id: '2',
              first_name: 'anth',
              last_name: 'oneil',
              img_ur: 'cutedogpic'
            },
          ];
          return onLoad(users);
        };
      }
      var subject = new UserService(userResource, undefined, authService);
      subject.getFollowing('me', function(err, response){
        expect(err).to.eql(undefined);
        expect(response.length).to.eql(2);
        expect(response[1].user_id).to.eql('2');
        done();
      });
    });
  });
  describe('Follow', function(){
    it('needs id', function(done){
      var subject = new UserService(undefined, undefined, authService);
      subject.follow(undefined, function(err, response){
        expect(err.message).to.eql('Id is Required');
        done();
      });
    });
    it('has correct params', function (done){
      function followResource(url, params, method) {
        this.execute = function(){};
        expect(url).to.contain('/user/follow');
        expect(params).to.eql(undefined);
        expect(method.execute.headers['Authorization']).to.eql('PAV_AUTH_TOKEN 000001');
        done();
      };
      authService.getAccessToken = function(){return 'PAV_AUTH_TOKEN 000001'};
      var subject = new UserService(followResource, undefined, authService);
      subject.follow('id', function(err, response){});
    });
    it('returns error from server', function(done) {
      function followResource(url, params, method) {
        this.execute = function(body, onLoad, onError){
          onError('ERROR');
        };
      };
      var subject = new UserService(followResource, undefined, authService);
      subject.follow('id', function(err, response){
        expect(err.message).to.eql('Server Error');
        expect(err.error).to.eql('ERROR');
        expect(response).to.eql(undefined);
        done();
      });
    });
    it('returns success from server', function(done) {
      function followResource(url, params, method) {
        this.execute = function(body, onLoad, onError){
          onLoad(true);
        };
      };
      var subject = new UserService(followResource, undefined, authService);
      subject.follow('id', function(err, response){
        expect(err).to.eql(undefined);
        expect(response).to.eql(true);
        done();
      });
    });
  });
  describe('Unfollow', function(){
    it('needs id', function(done){
      var subject = new UserService(undefined, undefined, authService);
      subject.follow(undefined, function(err, response){
        expect(err.message).to.eql('Id is Required');
        done();
      });
    });
    it('has correct params', function(done){
      function followResource(url, params, method) {
        this.execute = function(state){
        };
        expect(url).to.contain('/user/unfollow');
        expect(params).to.eql(undefined);
        expect(method.execute.headers['Authorization']).to.eql('PAV_AUTH_TOKEN 000001');
        done();
      };
      authService.getAccessToken = function(){return 'PAV_AUTH_TOKEN 000001'};
      var subject = new UserService(followResource, undefined, authService);
      subject.unfollow('id', function(err, response){});
    });
    it('returns error from server', function(done) {
      function followResource(url, params, method) {
        this.execute = function(body, onLoad, onError){
          onError('ERROR');
        };
      };
      var subject = new UserService(followResource, undefined, authService);
      subject.unfollow('id', function(err, response){
        expect(err.message).to.eql('Server Error');
        expect(err.error).to.eql('ERROR');
        expect(response).to.eql(undefined);
        done();
      });
    });
    it('returns success from server', function(done) {
      function followResource(url, params, method) {
        this.execute = function(body, onLoad, onError){
          onLoad(true);
        };
      };
      var subject = new UserService(followResource, undefined, authService);
      subject.unfollow('id', function(err, response){
        expect(err).to.eql(undefined);
        expect(response).to.eql(true);
        done();
      });
    });
  });
});

