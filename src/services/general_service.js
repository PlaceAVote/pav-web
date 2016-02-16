var rConfig = require('../config/endpoints.js');

function get(Resource, config, options, callback) {
  options = options || {};
  var spec = options.spec;
  if (!spec) {
    callback({message: 'spec not defined'});
    return;
  }
  if (!options.properties) {
    callback({message: 'properties not defined'});
    return;
  }

  var method;
  try {
    method = config[spec.resource][spec.method];
  }
  catch (e) {
    callback(e);
    return;
  }
  var specProperties = method.properties;

  if (!specProperties) {
    callback({message: 'resource method not defined in config'});
    return;
  }

  for (var i = 0, len = specProperties.length; i < len; i++) {
    var property = specProperties[i];
    if (!options.properties[property]) {
      callback({message: 'a required property is not included in the options properties'});
      return;
    }
  }

  var url = method.endpoint(options.properties);
  var pack = {};
  pack[options.spec.method] = config.methods[options.spec.type];
  var request = new Resource(url, null, pack);

  var onError = function(err) {
    callback(err);
    return;
  };

  var onLoad = function(result) {
    if (options.transformer) {
      callback(null, options.transformer(result));
      return;
    }
    callback(null, result);
    return;
  };
  request[options.spec.method](null, onLoad, onError);
}

function service(resource, config) {
  config = config || rConfig;
  return {
    get: function(options, callback) {
      get(resource, config, options, callback);
    },
  };
}

module.exports = service;
