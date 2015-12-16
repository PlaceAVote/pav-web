var expect = require('chai').expect;
var NotificationService = require('../../src/services/notification_service.js');

describe('Notification Service', function() {
  var authService = {
    getRawAccessToken: function() {
      return 'testToken';
    }
  };
  var streamer = {
    close: function() {
      closed = true;
    }
  };
  var options = {
    streamer: streamer,
  };
  it('Connects to web socket', function(done) {
    var subject = new NotificationService(undefined, authService, options);
    expect(subject.getStreamer()).to.eql(undefined);
    done();
  });
  it('doesnt set the streamer if token isnt defined', function(done) {
    var authService = {
      getRawAccessToken: function(){
        return undefined;
      }
    };
    var subject = new NotificationService(undefined, authService, options);
    subject.stream(function(err, result){
      expect(err).to.eql('Cant establish web socket with no authentication token');
      done();
    });
  });
  it('Closes websocket when call logout', function(done){
    var subject = new NotificationService(undefined, authService, options);
    subject.stream(function(err, result){
      var streamer = subject.getStreamer();
      expect(streamer).to.not.eql(undefined);
      subject.close();
      streamer = subject.getStreamer();
      expect(closed).to.eql(true);
      expect(streamer).to.eql(undefined);
      done();
    });
    streamer.onerror('Error');
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
