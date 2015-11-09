var config = require('../config/endpoints.js');
var CurrentVote = require('../models/current_vote.js');

function VotesService($resource, authService, userService) {
  var getVotesForBill = function(billId, callback){
    if(!billId){
      return callback({message: 'Bill Id not specified'});
    }
    var url = config.votes.getForBill.endpoint + billId;
    config.methods.get.headers['Authorization'] = authService.getAccessToken();
    var resource = new $resource(url, billId, {getForBill: config.methods.get});
    var onError = function(err){
      return callback(err);
    };
    var onLoad = function(data){
      return callback(undefined, new CurrentVote(data['bill-id'], data['yes-count'], data['no-count']));
    }
    resource.getForBill(undefined, onLoad, onError);
  };

  var voteOnBill = function(billId, vote, callback) {
    if(!billId) {
      return callback({message: 'Bill Id not specified'});
    }
    if(typeof(vote) != 'boolean') {
      return callback({message: 'No Vote Cast'});
    }

    var url = config.votes.voteOnBill.endpoint;
    config.methods.put.headers['Authorization'] = authService.getAccessToken();
    config.methods.put.transformResponse = [];
    var resource = new $resource(url, undefined, {voteOnBill: config.methods.put});
    var body = {
      'bill-id': billId,
      vote: vote
    };
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(response) {
      return callback(undefined, true);
    };
    resource.voteOnBill(body, onLoad, onError);
  };

  return {
    getVotesForBill: getVotesForBill,
    voteOnBill: voteOnBill,
  };
}

module.exports = VotesService;

