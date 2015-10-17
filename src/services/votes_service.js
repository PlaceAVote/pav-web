var config = require('../config/endpoints.js');
var CurrentVote = require('../models/current_vote.js');

function VotesService($resource, authService, userService) {
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

  var voteOnBill = function(billId, vote, callback) {
    if(!billId) {
      return callback({message: 'Bill Id not specified'});
    }
    if(typeof(vote) != 'boolean') {
      return callback({message: 'No Vote Cast'});
    }
    var user = userService.getUser();
    if(!user) {
      return callback({message: 'User is not specified'});
    }
    var url = config.votes.voteOnBill.endpoint;
    config.methods.put.headers['PAV_AUTH_TOKEN'] = authService.getAccessToken();
    var resource = new $resource(url, undefined, {voteOnBill: config.methods.put});
    var body = {
      'bill-id': billId,
      user: user.id,
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

