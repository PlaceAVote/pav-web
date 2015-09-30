var Bill = require("../models/bill.js");
//temporary until endpoint is made
var resource = require("../temp/mockBillResource.js");

function BillService($resource){
    $resource = $resource || resource;
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
