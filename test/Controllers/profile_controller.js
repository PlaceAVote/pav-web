var expect = require('chai').expect;
var ProfileController = require('../../src/controllers/profile_controller.js');

describe('Populate Profile', function() {
  var location = {
    path: function(){}
  };
  var authService = {
    validateToken: function(callback) {
      return callback(true);
    }
  };
  var routeParams = {
      id: 'me'
  };
  var response = {
    last_timestamp: 1455373943131,
    timeline: [],  
  };
    var getUserCalled = false;
    var getTimeline = false;
    var following = false;
    var followers = false;
    var userService = {
      getUserProfile: function() {
        getUserCalled = true;
      },
      getUserTimeline: function() {
        getTimeline = true;
      },
      getFollowers: function() {
        followers = true;
      },
      getFollowing: function() {
        following = true;
      },
      getUserTimeline: function(timestamp, id, callback) {
        return callback(undefined, response);
      },
    };

    var mockRootScope = {};
  it('calls all populate methods', function(done) {
      var subject = new ProfileController(undefined, location, routeParams, authService, userService, undefined, mockRootScope);
      expect(getUserCalled).to.eql(true);
      expect(followers).to.eql(true);
      expect(following).to.eql(true);
      done();
  });

  it('gets new timeline events querying timeline endpoint with timestamp deliveryed from the previous timeline payload', function(done){
    var subject = new ProfileController(undefined, location, routeParams, authService, userService, undefined, mockRootScope);
    subject.newTimestamp = '1234';
    subject.lastLoaded = '1233';
    subject.getTimeLineEvents();
    expect(subject.newTimestamp).to.equal(1455373943131);
    expect(subject.loadingScroll).to.equal(false);
    done();
  });

    it('It returns if loading progress', function(done){
    var subject = new ProfileController(undefined, location, routeParams, authService, userService, undefined, mockRootScope);
    subject.loadingScroll = true;
    subject.getTimeLineEvents();
    expect(subject.loadingScroll).to.equal(true);
    done();
  });

    it('It returns if newTimestamp and lastLoaded are the same', function(done){
    var subject = new ProfileController(undefined, location, routeParams, authService, userService, undefined, mockRootScope);
    subject.loadingScroll = null;
    subject.newTimestamp = '1234';
    subject.lastLoaded = '1234';
    subject.getTimeLineEvents();
    expect(subject.loadingScroll).to.equal(null);
    done();
  });

    it('inApp should be true', function() {
    var subject = new ProfileController(undefined, location, routeParams, authService, userService, undefined, mockRootScope);
    expect(subject.rs.inApp).to.equal(true);
    })

    
});


