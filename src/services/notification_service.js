var NotificationEventFactory = require('../factories/notification_event_factory.js');
var endpoint = require('../config/endpoints.js').notifications.socket;

var defaultStreamer = require('../connections/streamer.js');

function NotificationService (options) {
  options = options || {};
  var streamer = options.streamer || defaultStreamer({endpoint: endpoint});

  var stream = function(callback) {
    streamer.onerror = function(err) {
     console.log("ERROR", err);
      return callback(err);
    };

    streamer.onmessage = function(message) {
      var notifications = NotificationEventFactory.getResponses(message);
      return callback(undefined, notifications);
    };
  };

  var getStreamer = function(){
    return streamer;
  }

  return {
    stream: stream,
    getStreamer: getStreamer,
  };
}

module.exports = NotificationService;

