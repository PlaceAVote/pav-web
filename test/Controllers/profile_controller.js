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
  it('calls all populate methods', function(done) {
    var getUserCalled = false;
    var getTimeline = false;
    var userService = {
      getUserProfile: function() {
        getUserCalled = true;
      },
      getUserTimeline: function() {
        getTimeline = true;
      },
    };
      var subject = new ProfileController(undefined, location, authService, userService);
      expect(getUserCalled).to.eql(true);
      expect(getTimeline).to.eql(true);
      done();
  });
});
