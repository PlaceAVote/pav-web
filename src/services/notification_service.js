var NotificationEventFactory = require('../factories/notification_event_factory.js');
var endpoint = require('../config/endpoints.js').notifications.socket;
var config = require('../config/endpoints.js');

var defaultStreamer = require('../connections/streamer.js');

function NotificationService($resource, authService, options) {
  options = options || {};
  var streamer;
  var stream = function(callback) {
    var token = authService.getRawAccessToken();
    if (!token) {
      return callback('Cant establish web socket with no authentication token');
    }
    var url = endpoint + '?token=' + token;
    streamer = options.streamer || defaultStreamer({endpoint: url});
    streamer.onerror = function(err) {
      return callback(err);
    };

    streamer.onmessage = function(message) {
      return callback(undefined, NotificationEventFactory.getResponse(JSON.parse(message.data)));
    };
  };

  var close = function(callback) {
    if (!streamer) {
      return;
    }
    streamer.close();
    streamer = undefined;
    callback(undefined);
  };

  var getStreamer = function() {
    return streamer;
  };

  var getNotifications = function(timestamp, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      return callback('No Token Available');
    }

    var onLoad = function(res) {
      try {
        var results = {
          last_timestamp: res.last_timestamp,
          results: NotificationEventFactory.getResponses(res.results),
        };
        return callback(undefined, results);
      }
      catch (e) {
        return callback(e);
      }
    };

    var onError = function(err) {
      callback(err);
    };
    var url = config.notifications.staticEndpoint;
    var body = {};
    if (timestamp) {
      body.from = timestamp;
    }
    config.methods.get.headers.Authorization = token;
    var resource = new $resource(url, body, {get: config.methods.get});
    resource.get(onLoad, onError);
  };

  var readNotification = function(id, callback) {
    var onLoad = function(res) {
      callback(undefined, res);
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.notifications.read(id);
    config.methods.post.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {post: config.methods.post});
    resource.post(onLoad,onError);
  };

  return {
    stream: stream,
    getStreamer: getStreamer,
    getNotifications: getNotifications,
    readNotification: readNotification,
    close: close,
  };
}

module.exports = NotificationService;

