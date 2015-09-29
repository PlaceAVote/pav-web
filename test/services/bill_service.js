var BillService = require('../../src/services/bill_service.js');
var Bill = require('../../src/models/bill.js');
var expect = require('chai').expect;

describe("Bill Service", function(){
    var mockResource = {
        get : function() {
            return [
                {
                "type": "bill",
                "subject": "Health",
                "bill_id": "hr2-114",
                "total_comments": "34",
                "short_title": "Medicare Access and CHIP Reauthorization Act of 2015",
                    "votes": {
                        "yes": 2,
                        "no": 50
                    }
                },
                {
                "type": "bill",
                "subject": "Guns",
                "bill_id": "gu1-123",
                "total_comments": "80",
                "short_title": "Shooting people for the sake of it",
                    "votes": {
                        "yes": 100,
                        "no": 78
                    }
                }
            ]
         }
    };
it("Returns a list of bills", function(){
    var subject = new BillService(mockResource);
    var results = subject.getBills();
    expect(results.length).to.eql(2);
    expect(results[0] instanceof Bill).to.eql(true);
    expect(results[1] instanceof Bill).to.eql(true);
});
});
