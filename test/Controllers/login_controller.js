var expect = require("chai").expect;
var jsdom = require('mocha-jsdom');
var LoginCtrl;
var document = {document: { body: { addEventListener: function(){}}}};
var authService = {
  validateToken: function(callback){
    return callback(false);
  },
};

var Analytics = {
  trackEvent: function() {return;}
};

describe('LoginCtrl', function() {
  jsdom();
  before(function() {
    LoginCtrl = require("../../src/controllers/login_controller.js");
  });
  var mockLocationGlobal = {
    $$search: {
      forgot: false,
    },
  };

  it('Should make sure the email fail if not valid', function() {
    var scope = {};
    scope.$on = function() {};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
    subject.user.email = "anthony.com";
    expect(subject.emailValidation(subject.user.email)).to.be.false;
  });

  it('Should return true if valid', function() {
    var scope = {};
    scope.$on = function() {};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
    subject.user.email = "anthonyemail@test.com";
    expect(subject.emailValidation(subject.user.email)).to.be.true;
  });


  it('Should make sure the password fails client side validation', function() {
    var scope = { $on: function() {}};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);

    expect(subject.passwordValidation('cat')).to.eql(false);
  });

  it('Should return true is password is valid', function() {
    var scope = { $on: function() {}};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
    expect(subject.passwordValidation("password")).to.eql(true);
  });

  it('Should not call location when neither password and email are valid', function() {
    var changed = false;
    var created = false;
    var scope = { $on: function() {}};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
    var user = {
      email : 'anthonyemail.com',
      password : 'dog'
    }
    subject.userService = {
      createUser : function(){
        created = true;
      },
    };
    subject.location = {
      path : function() {
        changed = true;
      },
    };
    subject.validate(user);
    expect(changed).to.eql(false);
    expect(created).to.eql(false);
    expect(subject.user.emailValid).to.eql(false);
    expect(subject.user.passwordValid).to.eql(false);
  });

  it('Should allow valid email address and password to pass client side validation', function() {
    var created = false;
    var changed = false;
    var emailChecked = false;
    var checkedEmail;
    var scope = { $on: function() {}};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
    var user = {
      email : "testing.test1@test.com",
      password : "p34swOrD1"
    };
    subject.userService = {
      createUser : function(){
        created = true;
      },
      checkEmail: function(email, callback) {
        checkedEmail = email;
        emailChecked = true;
        callback(true);
      },
    };
    subject.location = {
      path : function() {
        changed = true;
      },
    };
    subject.validate(user);
    expect(subject.user.emailValid).to.eql(true);
    expect(subject.user.passwordValid).to.eql(true);
    expect(checkedEmail).to.eql('testing.test1@test.com');
    expect(changed).to.eql(true);
    expect(created).to.eql(true);
    expect(emailChecked).to.eql(true);
  });
  it('Should not call location or create if checkEmail returns false', function() {
    var created = false;
    var changed = false;
    var scope = { $on: function() {}};
    var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
    var user = {
      email : "testing.test1@test.com",
      password : "p34swOrD1"
    };
    subject.userService = {
      createUser : function(){
        created = true;
      },
      checkEmail: function(email, callback) {
        callback(false);
      },
    };
    subject.location = {
      path : function() {
        changed = true;
      },
    };
    subject.validate(user);
    expect(changed).to.eql(false);
    expect(created).to.eql(false);
    expect(subject.emailUsed).to.eql(true);
  });
  describe("Facebook login", function(){
    it("should call go with 'topics' if user is undefined", function(done){
      var location = {
        path: function(dest){
          expect(dest).to.eql('/onboarding');
          done();
        },
        $$search: {
          forgot: false,
        },
      };
      var scope = {}
      scope.$on = function() {};
      var subject = new LoginCtrl(scope, location, {}, authService, {}, {}, {}, {}, document, Analytics);
      subject.userService = {
        loginWithFacebook : function(callback){
          callback({status:400, message:"User Not Found"});
        },
      };
      subject.go = function(hash){
        expect(hash).to.eql("/onboarding");
        done();
      };
      subject.loginWithFacebook();
    });
    it("should go home if user has no facebook authentication", function(done){
      var location = {
        path: function(dest){
          expect(dest).to.eql('/');
          done();
        },
        $$search: {
          forgot: false,
        },
      };
      var scope = {}
      scope.$on = function() {};
      var subject = new LoginCtrl(scope, location, {}, authService, {}, {}, {}, {}, document, Analytics);
      subject.userService = {
        loginWithFacebook : function(callback){
          callback({status:999, message:"User Not Found"});
        },
      };
      subject.go = function(hash){
        expect(hash).to.eql("/onboarding");
        done();
      };
      subject.loginWithFacebook();
    });
    it("should get user profile and call go with 'feed' if no errors", function(done){
      var location = {
        path: function(dest){
          expect(dest).to.eql('/feed');
          done();
        },
        $$search: {
          forgot: false,
        },
      };
      var scope = {};
      scope.$on = function() {};
      var called = false;
      var subject = new LoginCtrl(scope, location, {}, authService, {}, {}, {}, {}, document, Analytics);
      subject.userService = {
        loginWithFacebook : function(callback){
          callback();
        },
        getUserProfile : function(id, callback) {
          called = true;
          callback(undefined, true);
        },
      };
      subject.loginWithFacebook();
      expect(called).to.eql(true);
    });
  });
  describe("failed login", function() {
    it("sets loginInvalid to false", function(done){
      var scope = {};
      scope.$on = function() {};
      var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
      subject.userService = {
        login : function(params, callback){
          callback({status:401});
        },
      };
      var test = function(callback){
        subject.login({email: 'paul@test.com', password: 'tesTING123'}, 'destination');
        callback();
      }
      test(function(){
        expect(subject.loginInvalid).to.eql(true);
        done();
      });
    });
  });
  describe("Forgot password", function() {
    it("Should return status 200 when password reset is successful", function() {
      var scope = {};
      var mockTimeOut = function() {return};
      scope.$on = function() {};
      var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, mockTimeOut, document, Analytics);
      subject.passwordService = {
        passwordReset : function(params, callback) {
          callback(undefined, {status: '200'});
        },
      };
      subject.passwordReset('user@email.com', function(err, res) {
        expect(res).to.equal({status: '200'});
        expect(subject.resetFailed).to.equal(false);
        expect(subject.resetSuccess).to.equal(true);
      });
    });
    it("Should return status 401 when password reset has failed", function() {
      var scope = {};
      scope.$on = function() {};
      var subject = new LoginCtrl(scope, mockLocationGlobal, {}, authService, {}, {}, {}, {}, document, Analytics);
      subject.passwordService = {
        passwordReset : function(params, callback) {
          callback({status: '401'});
        },
      };
      subject.passwordReset('user@email.com', function(err) {
        expect(err).to.equal({status: '401'});
        expect(subject.resetFailed).to.equal(true);
        expect(subject.resetSuccess).to.equal(false);
      });
    });
  });

  it("should set facebook login bool to true if it returns an error", function() {
    var mockUserService = {
      loginWithFacebook: function(callback) {
        var err = {status: 401};
        return callback(err);
      },
    };
    var mockRootScope = {
      facebookSignUp: false,
    }

    var mockLocation = {
      path: function() {
        return;
      },
      $$search: {
        forgot: false,
      },
    };

    var scope = {};
    scope.$on = function() {};

    var subject = new LoginCtrl(scope, mockLocation, mockUserService, authService, mockRootScope, mockLocationGlobal, {}, {}, document, Analytics);
    subject.loginWithFacebook();
    expect(subject.rs.facebookSignUp).to.equal(true);

  });

  it("should set path to root if facebook login returns an error status 999", function() {
    var mockUserService = {
      loginWithFacebook: function(callback) {
        var err = {status: 999};
        return callback(err);
      },
    };
    var mockRootScope = {
      facebookSignUp: false,
    }

    var mockLocation = {
      path: function() {
        return;
      },
      $$search: {
        forgot: false,
      },
    };

    var scope = {};
    scope.$on = function() {};

    var subject = new LoginCtrl(scope, mockLocation, mockUserService, authService, mockRootScope, mockLocationGlobal, {}, {}, document, Analytics);
    subject.loginWithFacebook();
    expect(subject.rs.facebookSignUp).to.equal(false);
    expect(subject.loaded).to.equal(true);

  });

  it("should set inApp bool to true and notLoggedIn to false if login is successful via facebook ", function() {
    var mockUserService = {
      loginWithFacebook: function(callback) {
        var res = true;
        return callback(undefined, res);
      },
      getUserProfile: function(id, callback) {
        var res = true;
        return callback(undefined, res);
      },
    };

    var mockRootScope = {
      inApp: false,
      notLoggedIn: true,
    };

    var mockLocation = {
      path: function() {
        return;
      },
      $$search: {
        forgot: false,
      },
    };

    var scope = {};
    scope.$on = function() {};

    var subject = new LoginCtrl(scope, mockLocation, mockUserService, authService, mockRootScope, mockLocationGlobal, {}, {}, document, Analytics);
    subject.loginWithFacebook();
    expect(subject.rs.inApp).to.equal(true);
    expect(subject.rs.notLoggedIn).to.equal(false);
    expect()
  });

  it("should set inApp bool to true and notLoggedIn to false if login is successful via email", function() {
    var mockUserService = {
      getUserProfile: function(id, callback) {
        var res = true;
        return callback(undefined, res);
      },
      login: function(user, callback) {
        var res = true;
        return callback(undefined, res);
      },
    };

    var mockRootScope = {
      inApp: false,
      notLoggedIn: true,
    };

    var mockLocation = {
      path: function() {
        return;
      },
      $$search: {
        forgot: false,
      },
    };

    var scope = {};
    scope.$on = function() {};
    var mockUser = {
      password: 'P4ssword',
      email: 'anema',
    };

    var subject = new LoginCtrl(scope, mockLocation, mockUserService, authService, mockRootScope, mockLocationGlobal, {}, {}, document, Analytics);
    subject.login(mockUser);
    expect(subject.rs.inApp).to.equal(true);
    expect(subject.rs.notLoggedIn).to.equal(false);
  });

});
