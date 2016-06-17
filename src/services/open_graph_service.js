var config = require('../config/endpoints.js');

/**
* getData implementation.
* @param request
* @param url - The URL for the open graph data.
* @param callback
*/
function getData(request, url, callback) {
  if (!url) {
    return callback(new Error('No URL defined'));
  }
  var onLoad = function(data) {
    return callback(null, data);
  }
  var onError = function(err) {
    return callback(err, null);
  }
  var endpoint = config.openGraph.scrape(url);
  var req = new request(endpoint, undefined, { data: config.methods.get });
  req.data(undefined, onLoad, onError);
}

/**
 * Open Graph Service Interface.
 */
var openGraphService = function(request){
  return {
    getData: function(url, callback) {
      return getData(request, url, callback);
    },
  };
};

module.exports = openGraphService;
