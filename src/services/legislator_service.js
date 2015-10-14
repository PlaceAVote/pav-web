var config = require('../config/endpoints.js');
var Legislator = require('../models/legislator.js');

function LegislatorService($resource, authService){
  var getById = function(id, callback){
    if(!id) {
      return callback({message: 'ID Not Provided'});
    }
    var onLoad = function(result){
     return callback(undefined, new Legislator(result));
    };
    var onError = function(err) {
      return callback(err);
    };
    config.methods.get.headers['PAV_AUTH_TOKEN'] = authService.getAccessToken();
    var url = config.legislator.getById.endpoint + id;
    var resource = new $resource(url, id, {getById : config.methods.get});
    resource.getById(undefined, onLoad, onError);
  }
  return {
    getById: getById,
  };
}

module.exports = LegislatorService;

