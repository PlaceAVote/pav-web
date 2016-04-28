var config = require('../config/endpoints.js');
var SearchResults = require('../models/search_results.js');
var BillSummary = require('../models/bill_summary.js');

function bills($resource, query, callback) {
  if (!query) {
    return callback(null, []);
  }
  query = query.replace('-', '%20');
  var url = config.search.bills(query);
  var resource = new $resource(url, undefined, {call: config.methods.getArray});

  function onLoad(results) {
    var mapped = results.map(function(result) {
      return new BillSummary(result);
    });
    return callback(null, mapped);
  }
  function onError() {
    callback(null, []);
  }
  resource.call(undefined, onLoad, onError);
}

/**
 * Given a query return search results
 */
function search($resource, authService, query, callback) {
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

/**
 * Interface for Search Service.
 */
function SearchService($resource, authService) {
  return {
    search: function(query, callback) {
      search($resource, authService, query, callback);
    },
    bills: function(query, callback) {
      bills($resource, query, callback);
    },
  };
}

module.exports = SearchService;
