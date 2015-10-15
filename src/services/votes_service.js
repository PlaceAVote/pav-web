var config = require('../config/endpoints.js');
var CurrentVote = require('../models/current_vote.js');

function VotesService($resource, authService){
  var getVotesForBill = function(billId, callback){
    if(!billId){
      return callback({message: 'Bill Id not specified'});
    }
    var url = config.votes.getForBill.endpoint + billId;
    config.methods.get.headers['PAV_AUTH_TOKEN'] = authService.getAccessToken();
    var resource = new $resource(url, billId, {getForBill: config.methods.get});
    var onError = function(err){
      return callback(err);
    };
    var onLoad = function(data){
      return callback(undefined, new CurrentVote(data['bill-id'], data['yes-count'], data['no-count']));
    }
    resource.getForBill(undefined, onLoad, onError);
  };
  return {
    getVotesForBill: getVotesForBill,
  };
}

module.exports = VotesService;

