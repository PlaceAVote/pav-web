var config = require('../config/endpoints.js');
var SearchResults = require('../models/search_results');

function SearchService($resource, authService) {
  function search(query, callback) {
    var token = authService.getAccessToken();

    var onLoad = function(res) {
      var results = new SearchResults(res);
      callback(undefined, results);
    };

    var onError = function(err) {
      callback(err);
    };

    var params = {
      term: query,
    };

    var url = config.search.endpoint;

    if (token) {
      config.methods.getArray.headers.Authorization = token;
    }
    var resource = new $resource(url, undefined, {search: config.methods.getArray});
    resource.search(params, onLoad, onError);
  }

  return {
    search: search,
  };
}

module.exports = SearchService;
