var NotificationEventFactory = require('../factories/notification_event_factory.js');
var endpoint = require('../config/endpoints.js').notifications.socket;
var config = require('../config/endpoints.js');

var defaultStreamer = require('../connections/streamer.js');

function NotificationService ($resource, authService, options) {
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
     console.log("ERROR", err);
      return callback(err);
    };

    streamer.onmessage = function(message) {
      var notifications = NotificationEventFactory.getResponses(message.data);
      return callback(undefined, notifications);
    };
  };

  var close = function(){
    if (!streamer) {
      return;
    }
    streamer.close();
    streamer = undefined;
  }

  var getStreamer = function(){
    return streamer;
  }

  var getNotifications = function(callback) {
    var token = authService.getAccessToken();
    if (!token) {
      return callback('No Token Available');
    }

    var onLoad = function(res) {
      var notifications = [];
      var notification;
      for (var i = 0; i < res.results.length; i++) {
      notification = NotificationEventFactory.getResponses(res.results[i]);
      notifications.push(notification[0]);
      }
      callback(undefined, notifications);
    }

    var onError = function(err) {
      callback(err);
    }
    var url = config.notifications.staticEndpoint;
    config.methods.get.headers['Authorization'] = token;
    var resource = new $resource(url, undefined, {get: config.methods.get});
    resource.get(onLoad, onError);
  };

  var readNotification = function(id, callback) {
    var onLoad = function(res) {
      callback(undefined, res);
    }

    var onError = function(err) {
      callback(err);
    }

    var url = config.notifications.read(id);
    config.methods.post.headers['Authorization'] = authService.getAccessToken();
    var resource = new $resource(url, undefined, {post: config.methods.post});
    resource.post(onLoad,onError);
  }

  return {
    stream: stream,
    getStreamer: getStreamer,
    getNotifications: getNotifications,
    readNotification: readNotification,
    close: close,
  };
}

module.exports = NotificationService;

