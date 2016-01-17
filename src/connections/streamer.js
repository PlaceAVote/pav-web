var defaultStreamer = function(options) {
  return new WebSocket(options.endpoint);
};

module.exports = defaultStreamer;
