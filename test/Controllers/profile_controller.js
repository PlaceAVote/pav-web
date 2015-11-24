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
  it('calls all populate methods', function(done) {
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
    };
      var subject = new ProfileController(undefined, location, routeParams, authService, userService);
      expect(getUserCalled).to.eql(true);
      expect(getTimeline).to.eql(true);
      expect(followers).to.eql(true);
      expect(following).to.eql(true);
      done();
  });
});
