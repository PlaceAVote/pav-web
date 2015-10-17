var BillSummary = require('../models/bill_summary.js');
var Bill = require('../models/bill.js');
var Comment = require('../models/comment.js');
var config = require('../config/endpoints.js');


function BillService(tempBillResource, $resource, authService){
    var getBills = function(username, callback) {
        var onLoad = function(result) {
            var bills = [];
            for(r in result){
                bills.push(new BillSummary(result[r]));
            };
            callback(undefined, bills);
        };
        var onError = function(err){
            callback(err);
        };
        var results = tempBillResource.get(undefined, onLoad, onError);
    };

    var getBill = function(id, callback) {
      if(!id){
        return callback({message: 'Error: No Id Provided'});
      }
      var onLoad = function(result){
        return callback(undefined, new Bill(result));
      };
      var onError = function(err){
        return callback(err);
      };
      var url = config.bills.getById.endpoint + id;
      config.methods.get.headers['PAV_AUTH_TOKEN'] = authService.getAccessToken();
      var resource = new $resource(url, id,  {getById: config.methods.get});
      resource.getById(undefined, onLoad, onError);
    };

    var getTopComments = function(id, callback){
      if(!id){
        return callback({message: 'Id Must Be Defined'});
      }
      var onLoad = function(results){
        var result = {
          forComment: new Comment(results['for-comment']),
          againstComment: new Comment(results['against-comment']),
        };
        return callback(undefined, result);
      }
      var onError = function(err){
        return callback(err);
      }
      var url = config.bills.topComments.endpoint(id);
      config.methods.get.headers['PAV_AUTH_TOKEN'] = authService.getAccessToken();
      var resource = new $resource(url, id,  {getComments: config.methods.get});
      resource.getComments(undefined, onLoad, onError);
    };

    return {
      getBills: getBills,
      getBill: getBill,
      getTopComments: getTopComments,
    };
}


module.exports = BillService;
