var Bill = require("../models/bill.js");

function BillService($resource){
    var getBills = function(username, callback) {
        var onLoad = function(result) {
            var bills = [];
            for(r in result){
                bills.push(new Bill(result[r]));
            };
            callback(undefined, bills);
        };
        var onError = function(err){
            callback(err);
        };
        var results = $resource.get(undefined, onLoad, onError);
    };

    return {
        getBills: getBills
    }
}


module.exports = BillService;
