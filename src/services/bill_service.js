var BillSummary = require('../models/bill_summary.js');
var Bill = require('../models/bill.js');
var Comment = require('../models/comment.js');
var config = require('../config/live_endpoints.js');


function BillService(tempBillResource, $resource){
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
      var resource = new $resource(url, id,  {getById: config.bills.getById.method});
      resource.getById(undefined, onLoad, onError);
    };

    var getTopComment = function(id, callback){
      if(!id){
        return callback({message: 'Id Must Be Defined'});
      }
      var onLoad = function(result){
        return callback(undefined, new Comment(result));
      }
      var onError = function(err){
        return callback(err);
      }
      tempBillResource.getTopComment(undefined, onLoad, onError);
    };

    return {
      getBills: getBills,
      getBill: getBill,
      getTopComment: getTopComment,
    };
}


module.exports = BillService;
