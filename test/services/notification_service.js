var expect = require('chai').expect;
var NotificationService = require('../../src/services/notification_service.js');

describe('Notification Service', function() {
  var authService = {
    getRawAccessToken: function() {
      return 'testToken';
    }
  };
  var streamer = {};
  var options = {
    streamer: streamer,
  };
  it('Connects to web socket', function(done) {
    var subject = new NotificationService(undefined, authService, options);
    expect(subject.getStreamer()).to.eql(streamer);
    done();
  });
  it('Returns an error when an error occurs', function(done) {
    var subject = new NotificationService(undefined, authService, options);
    subject.stream(function(error, message){
      expect(error).to.equal('ERROR');
      done();
    });
    streamer.onerror('ERROR');
  });
  it('Returns data from the server', function(done) {
    var data = [];
    var subject = new NotificationService(undefined, authService, options);
    subject.stream(function(error, message){
      expect(message).to.deep.equal([]);
      done();
    });
    streamer.onmessage(data);
  });
});
