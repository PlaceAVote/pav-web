var expect = require('chai').expect;
var NotificationService = require('../../src/services/notification_service.js');

describe('Notification Service', function() {
  it('Connects to web socket', function(done) {
    var streamer = {
      onopen: function(callback) {
        this.onmessage(callback);
      },
      onerror:function(callback){},
      onmessage: function(callback){
        callback({});
     }
    };
    var options = {
      streamer: streamer,
    };
    var subject = new NotificationService(options);
    subject.stream(function(error, message){
      expect(message).to.deep.equal([]);
      done();
    });
  });
  it('Returns an error when an error occurs', function(done) {
    var streamer = {
      onopen: function(callback) {
        this.onerror(callback);
      },
      onerror: function(callback) {
        callback('ERROR');
      },
      onmessage: function(callback){},
    };
    var options = {
      streamer: streamer,
    };
    var subject = new NotificationService(options);
    subject.stream(function(error, message){
      expect(error).to.equal('ERROR');
      done();
    });
  });
  it('Returns data from the server', function(done) {
    var data = [];
    var streamer = {
      onopen: function(callback) {
        this.onmessage(callback);
      },
      onerror:function(callback){},
      onmessage: function(callback){
        callback(data);
     }
    };
    var options = {
      streamer: streamer,
    };
    var subject = new NotificationService(options);
    subject.stream(function(error, message){
      expect(message).to.deep.equal([]);
      done();
    });
  });
});
