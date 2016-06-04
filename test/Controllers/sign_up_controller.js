var SignUpController = require('../../src/controllers/sign_up_controller.js');
var expect = require('chai').expect;

describe('SignUpController', function() {
  function MockUserService() {
    this.getUser = function() {
      return {
        name: 'paul',
      }
    };
    this.user = function() {
      return {}
    }
  }

  function rs() {
    return {
      loggedIn: false,
    }
  }

  var Analytics = {
    trackEvent: function() {return;},
  };

  it('has a user object', function() {
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
    var blankUser = {
      first_name: '',
      last_name: '',
      dob: '',
      zipcode: '',
      gender: undefined,
    };
    expect(subject.additionalInformation).to.eql(blankUser);
  });

  it('returns zip to false if is missing', function() {
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
    var result = subject.zipFormat();
    expect(result).to.eql(false);
  });

  it('returns zip to true if is in correct format', function() {
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
    var result = subject.zipFormat('90210');
    expect(result).to.eql(true);
  });

  it('returns zip to true if is in incorrect format', function() {
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
    var result = subject.zipFormat('cat stevens');
    expect(result).to.eql(false);
  });

  it('when service returns error, set scope.error to be true', function(done) {
    function MockUserService() {
      this.saveUser = function(callback) {
        callback('Server returned error');
        expect(subject.error).to.eql(true);
        done();
      };
      this.addAdditionalInformation = function() {

      };
      this.getUser = function() {
        return {
          name: 'paul',
          gender: 'they',
        }
      };
      this.user = function() {
        return
      }
    }
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
    subject.additionalInformation.zipcode = '90210';
    subject.signup();
  });
  it('prepopulates user data from service if user data is found', function() {
    function MockUserService() {
      var that = this;
      that.user = {
        first_name: 'paul',
        last_name: 'barber',
        email: 'test@test.com',
        dob: new Date('04/01/1990'),
        gender: 'male',
      };
      that.getUser = function() {
        return that.user;
      };
    }
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
    expect(subject.additionalInformation.first_name).to.eql('paul');
    expect(subject.additionalInformation.last_name).to.eql('barber');
    expect(subject.additionalInformation.dob).to.eql(new Date('04/01/1990'));
  });
  it('calls location path to feed when user has been created', function(done) {
    function MockUserService() {
      var that = this;
      that.user = {
        gender: 'they',
        first_name: 'paul',
        last_name: 'barber',
        email: 'test@test.com',
        dob: new Date('04/01/1990'),
      };
      that.getUser = function() {
        return that.user;
      };
      that.saveUser = function(callback) {
        return callback(undefined);
      };
      that.addAdditionalInformation = function() {};
    }
    function Location() {
      this.path = function(route) {
        expect(route).to.eql('/feed');
        done();
      }
    };
    var l = new Location();
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, l, mockUS, {}, Analytics);
    subject.additionalInformation.zipcode = '90210';
    subject.signup();
  });

  it('doesnt call service when zip is not defined', function() {
    var called = false;
    function MockUserService() {
      var that = this;
      that.user = {
        gender: 'they',
        first_name: 'paul',
        last_name: 'barber',
        email: 'test@test.com',
        dob: new Date('04/01/1990'),
      };
      that.getUser = function() {
        return that.user;
      };
      that.saveUser = function(callback) {
        called = true;
        return callback(undefined);
      };
      that.addAdditionalInformation = function() {};
    }
    function Location() {
      this.path = function(route) {
        expect(route).to.eql('/feed');
      }
    };
    var l = new Location();
    var mockUS = new MockUserService();
    var subject = new SignUpController(rs, undefined, l, mockUS, {}, Analytics);
    subject.signup();
    expect(called).to.eql(false);
  });
  describe('setDateAsUTCTime', function() {
    it('given a date sets the attionalInformations dob field as a utc timestamp', function() {
      var mockUS = new MockUserService();
      var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
      var date = new Date('25 Dec 1995 UTC');
      subject.setDateAsUTCTime(date);
      expect(subject.additionalInformation.dob).to.eql('819849600000');
    });
    it('does not set the date as a utc if its not a date', function() {
      var mockUS = new MockUserService();
      var subject = new SignUpController(rs, undefined, undefined, mockUS, {}, Analytics);
      subject.setDateAsUTCTime('not a date');
      expect(subject.additionalInformation.dob).to.eql('');
    });
  });
});
