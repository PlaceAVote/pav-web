var NotificationEventFactory = require('../factories/notification_event_factory.js');
var endpoint = require('../config/endpoints.js').notifications.socket;

var defaultStreamer = require('../connections/streamer.js');

function NotificationService (options) {
  options = options || {};
  var streamer = options.streamer || defaultStreamer({endpoint: endpoint});

  var stream = function(callback) {
    streamer.onopen(function(event){
      console.log('EVENT', event);

      streamer.onerror(function(err) {
        console.log(err);
        return callback(err);
      });

      streamer.onmessage(function(message) {
        console.log('message', message);
        var notifications = NotificationEventFactory.getResponses(message);
        return callback(undefined, notifications);
      });
    });
  };



  return {
    stream: stream,
  };
}

module.exports = NotificationService;

