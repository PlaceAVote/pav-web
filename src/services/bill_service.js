var Bill = require("../models/bill.js");

function BillService($resource){
    var getBills = function(username) {
        var results = $resource.get();
        var bills = [];
        for(result in results){
            bills.push(new Bill(results[result]));
        };
        return bills;
    };

    return {
        getBills: getBills
    }
}


module.exports = BillService;
