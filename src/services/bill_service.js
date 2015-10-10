var Bill = require("../models/bill_summary.js");
//temporary until endpoint is made
//var resource = require("../temp/mockBillResource.js");

function BillService(tempBillResource){
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
        var results = tempBillResource.get(undefined, onLoad, onError);
    };

    return {
        getBills: getBills
    }
}


module.exports = BillService;
