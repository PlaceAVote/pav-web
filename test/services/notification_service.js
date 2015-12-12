var expect = require('chai').expect;
var NotificationService = require('../../src/services/notification_service.js');

describe('Notification Service', function() {
  it('Connects to web socket', function(done) {
    var streamer = {};
    var options = {
      streamer: streamer,
    };
    var subject = new NotificationService(options);
    expect(subject.getStreamer()).to.eql(streamer);
    done();
  });
  it('Returns an error when an error occurs', function(done) {
    var streamer = {};
    var options = {
      streamer: streamer,
    };
    var subject = new NotificationService(options);
    subject.stream(function(error, message){
      expect(error).to.equal('ERROR');
      done();
    });
    streamer.onerror('ERROR');
  });
  it('Returns data from the server', function(done) {
    var data = [];
    var streamer = {};
    var options = {
      streamer: streamer,
    };
    var subject = new NotificationService(options);
    subject.stream(function(error, message){
      expect(message).to.deep.equal([]);
      done();
    });
    streamer.onmessage(data);
  });
});
