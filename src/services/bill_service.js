var BillSummary = require('../models/bill_summary.js');
var Bill = require('../models/bill.js');
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
      var resource = new $resource(config.bills.getById.endpoint, id,  {getById: config.bills.getById.method});
      resource.getById(undefined, onLoad, onError);
    };

    return {
      getBills: getBills,
      getBill: getBill,
    }
}


module.exports = BillService;
